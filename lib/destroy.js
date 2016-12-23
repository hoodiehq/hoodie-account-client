module.exports = destroy

var clone = require('lodash/clone')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.get = require('./get')
internals.isSignedIn = require('./is-signed-in')

function destroy (state) {
  var accountProperties
  return state.ready

  .then(function () {
    accountProperties = internals.get(state)

    if (internals.isSignedIn(state)) {
      return internals.request({
        method: 'DELETE',
        url: state.url + '/session/account',
        headers: {
          authorization: 'Session ' + state.account.session.id
        }
      })
    }
  })

  .then(function () {
    state.cache.unset()

    state.emitter.emit('signout', clone(state.account))
    state.emitter.emit('destroy', clone(state.account))

    delete state.account

    return clone(accountProperties)
  })
}
