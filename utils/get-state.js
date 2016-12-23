module.exports = getState

var Hook = require('before-after-hook')
var EventEmitter = require('events').EventEmitter
var LocalStorageStore = require('async-get-set-store')

var generateId = require('./generate-id')

function getState (options) {
  if (!options) {
    options = {}
  }

  if (typeof options === 'string') {
    options = {url: options}
  }

  if (!options.url) {
    throw new Error('options.url is required')
  }

  var cacheKey = options.cacheKey || 'account'
  var cache = options.cache || new LocalStorageStore(cacheKey)

  var state = {
    cacheKey: cacheKey,
    emitter: options.emitter || new EventEmitter(),
    hook: new Hook(),
    account: undefined,
    url: options.url,
    validate: options.validate || function () {},
    cache: cache,
    ready: cache.get()
      .then(function (storedAccount) {
        if (storedAccount.id) {
          state.account = storedAccount

          var storedAccountId = storedAccount.id
          if (options.id && storedAccountId && options.id !== storedAccountId) {
            throw new Error('account.id conflict')
          }

          return
        }

        state.account = {
          id: options.id || generateId(),
          createdAt: new Date().toISOString()
        }

        return cache.set(state.account)
      })
      .catch(function (error) {
        error.name = 'SetupError'
        error.message = 'Error while initialising: ' + error.message
        throw error
      })
  }

  return state
}
