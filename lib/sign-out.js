module.exports = signOut

var clone = require('lodash/clone')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.get = require('./get')
internals.isSignedIn = require('./is-signed-in')

function signOut (state) {
  if (!internals.isSignedIn(state)) {
    return Promise.reject(new Error('UnauthenticatedError: Not signed in'))
  }

  var accountProperties = internals.get(state)

  return state.hook('signout', function () {
    return internals.request({
      method: 'DELETE',
      url: state.url + '/session',
      headers: {
        authorization: 'Session ' + state.account.session.id
      }
    })
  })

  .then(function () {
    return state.store.unset()
  })

  .then(function () {
    var accountClone = clone(state.account)
    delete state.account

    state.emitter.emit('signout', accountClone)

    return clone(accountProperties)
  })
}
