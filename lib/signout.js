module.exports = signOut

var request = require('../helpers/request')
var clearSession = require('../helpers/clear-session')

function signOut (state) {
  return request({
    url: state.url + '/session',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + state.session.id
    },
    method: 'DELETE'
  })

  .then(function () {
    var username = state.session.account.username

    clearSession(state)
    return { username: username }
  })
}
