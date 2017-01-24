module.exports = signIn

var Promise = require('lie')
var clone = require('lodash/clone')
var get = require('lodash/get')

var internals = module.exports.internals = {}
internals.deserialise = require('../utils/deserialise')
internals.request = require('../utils/request')
internals.serialise = require('../utils/serialise')

function signIn (state, options) {
  if (!options) {
    options = {}
  }
  var usernameOrPasswordUnset = !options.username || !options.password
  if (usernameOrPasswordUnset && !options.token) {
    return Promise.reject(new Error('options.username/options.password or options.token required'))
  }

  return state.ready

  .then(function () {
    return state.hook('signin', options, function (options) {
      return internals.request({
        url: state.url + '/session',
        method: 'PUT',
        body: internals.serialise('session', options)
      })

      .then(function (response) {
        var data = internals.deserialise(response.body, {
          include: 'account'
        })

        // admins don’t have an account
        if (!data.account) {
          data.account = {
            username: options.username
          }
        }

        // If the username hasn’t changed, emit 'reauthenticate' instead of 'signin'
        var emitEvent = 'signin'
        if (get(state, 'account.username') === options.username) {
          emitEvent = 'reauthenticate'
        }

        state.account = {
          username: data.account.username,
          session: {
            id: data.id
          }
        }

        if (data.account.id) {
          state.account.id = data.account.id
        }

        state.cache.set(state.account)

        state.emitter.emit(emitEvent, clone(state.account))

        return data.account
      })
    })
  })
}
