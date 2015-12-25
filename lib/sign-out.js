module.exports = signOut

var clone = require('lodash.clone')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.clearSession = require('../utils/clear-session')
internals.get = require('./get')

function signOut (state) {
  var accountProperties = internals.get(state, 'account')

  return internals.request({
    method: 'DELETE',
    url: state.url + '/session',
    headers: {
      authorization: 'Bearer ' + state.session.id
    }
  })

  .then(function () {
    var id = state.session.account.id
    var username = state.session.account.username

    internals.clearSession({
      cacheKey: state.cacheKey
    })

    state.emitter.emit('signout', {
      id: id,
      username: username,
      session: {
        id: state.session.id
      }
    })

    delete state.session
    delete state.id

    return clone(accountProperties)
  })
}
