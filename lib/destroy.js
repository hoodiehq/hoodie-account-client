module.exports = destroy

var clone = require('lodash/clone')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.clearSession = require('../utils/clear-session')
internals.get = require('./get')
internals.isSignedIn = require('./is-signed-in')

function destroy (state) {
  var accountProperties = internals.get(state)

  var promise = Promise.resolve()

  if (internals.isSignedIn(state)) {
    promise = promise.then(function () {
      internals.request({
        method: 'DELETE',
        url: state.url + '/session/account',
        headers: {
          authorization: 'Session ' + state.account.session.id
        }
      })
    })
  }

  return promise.then(function () {
    internals.clearSession({
      cacheKey: state.cacheKey
    })

    state.emitter.emit('signout', clone(state.account))
    state.emitter.emit('destroy', clone(state.account))

    delete state.account

    return clone(accountProperties)
  })
}
