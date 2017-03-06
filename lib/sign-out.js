module.exports = signOut

var omit = require('lodash/omit')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.get = require('./get')
internals.generateId = require('../utils/generate-id')

function signOut (state) {
  return state.setup

  .then(function () {
    return state.cache.get()
  })

  .then(function (cache) {
    if (!cache.session) {
      throw new Error('UnauthenticatedError: Not signed in')
    }

    return state.hook('signout', function () {
      return internals.request({
        method: 'DELETE',
        url: state.url + '/session',
        headers: {
          authorization: 'Session ' + cache.session.id
        }
      })

      .then(function () {
        return state.cache.unset()
      })

      .then(function () {
        return state.cache.set({
          id: internals.generateId()
        })

        .then(function () {
          var account = omit(cache, 'session')
          state.emitter.emit('signout', account)

          return account
        })
      })
    })
  })
}
