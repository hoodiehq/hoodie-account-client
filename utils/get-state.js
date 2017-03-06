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
  var setup = cache.get()

  .then(function (storedAccount) {
    if (storedAccount.id) {
      if (options.id && options.id !== storedAccount.id) {
        throw new Error('account.id conflict')
      }

      return
    }

    storedAccount = {
      id: options.id || generateId(),
      createdAt: new Date().toISOString()
    }

    return cache.set(storedAccount)
  })

  .catch(function (error) {
    error.message = 'Error while initialising: ' + error.message
    throw error
  })

  var state = {
    cacheKey: cacheKey,
    emitter: options.emitter || new EventEmitter(),
    hook: new Hook(),
    url: options.url,
    validate: options.validate || function () {},
    cache: cache,
    setup: setup
  }

  return state
}
