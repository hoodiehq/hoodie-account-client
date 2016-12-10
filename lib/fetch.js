module.exports = fetch

var Promise = require('lie')
var get = require('lodash/get')
var merge = require('lodash/merge')
var set = require('lodash/set')

var internals = module.exports.internals = {}
internals.fetchProperties = require('../utils/fetch-properties')

function fetch (state, path) {
  if (!state.account) {
    var error = new Error('Not signed in')
    error.name = 'UnauthenticatedError'
    return Promise.reject(error)
  }
  return internals.fetchProperties({
    url: state.url + '/session/account',
    sessionId: get(state, 'account.session.id'),
    path: path
  })

  .then(function (properties) {
    if (typeof path === 'string') {
      set(state.account, path, properties)
    } else {
      merge(state.account, properties)
    }

    state.store.set(state.account)

    return properties
  })

  .catch(function (error) {
    if (error.statusCode === 401) {
      state.account.session.invalid = true
      state.emitter.emit('unauthenticate')

      state.store.set(state.account)
    }

    throw error
  })
}
