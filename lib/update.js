module.exports = update

var merge = require('lodash/merge')
var omit = require('lodash/omit')

var Promise = require('lie')

var internals = module.exports.internals = {}
internals.deserialise = require('../utils/deserialise')
internals.request = require('../utils/request')
internals.serialise = require('../utils/serialise')

function update (state, options) {
  if (!options) {
    return Promise.reject(new Error('Specify an account property to update'))
  }

  return state.setup

  .then(function () {
    return state.cache.get()
  })

  .then(function (cache) {
    return internals.request({
      method: 'PATCH',
      url: state.url + '/session/account',
      headers: {
        authorization: 'Session ' + cache.session.id
      },
      body: internals.serialise('account', options, cache.id)
    })

    .then(function (response) {
      // when a username changes, the session ID gets recalculated, as it’s based
      // on the username, see npm.im/couchdb-calculate-session-id. In that case
      // the server sets x-set-session with the new session id.
      if (response.headers['x-set-session']) {
        cache.session.id = response.headers['x-set-session']
      }

      merge(cache, omit(options, ['password']))
      state.cache.set(cache)

      var account = omit(cache, 'session')
      state.emitter.emit('update', account)

      return account
    })

    .catch(function (error) {
      if (error.statusCode === 401) {
        cache.session.invalid = true
        state.emitter.emit('unauthenticate')

        state.cache.set(cache)
      }

      throw error
    })
  })
}
