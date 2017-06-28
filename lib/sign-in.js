module.exports = signIn

var Promise = require('lie')
var omit = require('lodash/omit')

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

  return state.setup

  .then(function () {
    return state.cache.get()
  })

  .then(function (cache) {
    // If a different user is signed in than the one trying to signIn, throw an error
    if (cache.session && cache.username !== options.username) {
      return Promise.reject(new Error('You must sign out before signing in'))
    }

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
        var emitEvent = cache.username === data.account.username
          ? 'reauthenticate'
          : 'signin'

        cache = {
          username: data.account.username,
          session: {
            id: data.id
          }
        }

        if (data.account.id) {
          cache.id = data.account.id
        }

        state.cache.set(cache)

        state.emitter.emit(emitEvent, cache)

        return omit(cache, 'session')
      })
    })
  })
}
