module.exports = fetch

var Promise = require('../utils/promise')
var get = require('lodash.get')
var merge = require('lodash.merge')
var set = require('lodash.set')

var internals = module.exports.internals = {}
internals.fetchProperties = require('../utils/fetch-properties')
internals.saveACcount = require('../utils/save-account')

function fetch (state, path) {
  if (!state.account) {
    var error = new Error('Not signed in')
    error.name = 'UnauthenticatedError'
    return Promise.reject(error)
  }
  return internals.fetchProperties({
    url: state.baseUrl + '/session/account',
    bearerToken: get(state, 'account.session.id'),
    path: path
  })

.then(function (properties) {
  if (typeof path === 'string') {
    set(state.account, path, properties)
  } else {
    merge(state.account, properties)
  }

  internals.saveACcount({
    cacheKey: state.cacheKey,
    account: state.account
  })

  return properties
})
}
