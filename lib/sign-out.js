module.exports = signOut

var clone = require('lodash/clone')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.get = require('./get')
internals.isSignedIn = require('./is-signed-in')
internals.generateId = require('../utils/generate-id')

function signOut (state) {
  return state.ready

  .then(function () {
    if (!internals.isSignedIn(state)) {
      throw new Error('UnauthenticatedError: Not signed in')
    }

    return state.hook('signout', function () {
      return internals.request({
        method: 'DELETE',
        url: state.url + '/session',
        headers: {
          authorization: 'Session ' + state.account.session.id
        }
      })

      .then(function () {
        return state.cache.unset()
      })

      .then(function () {
        var accountClone = clone(state.account)

        state.account = {
          id: internals.generateId()
        }
        return state.cache.set(state.account)

        .then(function () {
          state.emitter.emit('signout', accountClone)

          return accountClone
        })
      })
    })
  })
}
