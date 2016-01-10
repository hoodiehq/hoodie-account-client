module.exports = signOut

var clone = require('lodash.clone')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.clearSession = require('../utils/clear-session')
internals.get = require('./get')

function signOut (state) {
  var accountProperties = internals.get(state)

  return internals.request({
    method: 'DELETE',
    url: state.url + '/session',
    headers: {
      authorization: 'Bearer ' + state.account.session.id
    }
  })

  .then(function () {
    internals.clearSession({
      cacheKey: state.cacheKey
    })

    state.emitter.emit('signout', clone(state.account))

    delete state.account

    return clone(accountProperties)
  })
}
