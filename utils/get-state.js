module.exports = getState

var Hook = require('before-after-hook')
var EventEmitter = require('events').EventEmitter
var get = require('lodash/get')

var generateId = require('./generate-id')
var LocalStorageStore = require('./localstorage-store')

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
  var store = new LocalStorageStore(cacheKey)
  var storedAccount = store.get()

  var state = {
    account: storedAccount,
    cacheKey: cacheKey,
    emitter: options.emitter || new EventEmitter(),
    hook: new Hook(),
    url: options.url,
    validate: options.validate || function () {},
    store: store
  }

  var storedAccountId = get(storedAccount, 'id')
  if (options.id && storedAccountId && options.id !== storedAccountId) {
    throw new Error('account.id conflict')
  }

  if (!state.account) {
    state.account = {
      id: options.id || generateId(),
      createdAt: new Date().toISOString()
    }

    store.set(state.account)
  }

  return state
}
