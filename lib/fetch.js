module.exports = fetch

var request = require('../helpers/request')
var saveSession = require('../helpers/save-session')
var get = require('./get')

function fetch (state, path) {
  return request({
    url: state.url + '/session/account',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + state.session.id
    }
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    saveSession(state, data)

    return get(state, path)
  })
}
