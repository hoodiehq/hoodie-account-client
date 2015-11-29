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
    delete state.session

    state.emitter.emit('signout', {
      id: id,
      username: username
    })

    return clone(accountProperties)
  })
}
