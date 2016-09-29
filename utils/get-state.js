module.exports = getState

var EventEmitter = require('events').EventEmitter
var get = require('lodash/get')

var generateId = require('./generate-id')
var getAccount = require('./get-account')
var saveAccount = require('./save-account')

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
  var storedAccount = getAccount({
    cacheKey: cacheKey
  })

  var state = {
    cacheKey: cacheKey,
    emitter: options.emitter || new EventEmitter(),
    account: storedAccount,
    url: options.url,
    validate: options.validate || function () {}
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

    saveAccount({
      cacheKey: cacheKey,
      account: state.account
    })
  }

  return state
}
