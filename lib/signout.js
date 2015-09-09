module.exports = signOut

var request = require('../helpers/request')
var clearSession = require('../helpers/clear-session')

function signOut (state) {
  return request({
    url: state.url + '/session',
    method: 'DELETE'
  })

  .then(function () {
    var username = state.session.account.username

    clearSession(state)
    return username
  })
}
