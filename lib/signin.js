module.exports = signIn

var request = require('../helpers/request')
var Promise = require('../helpers/promise')
var saveSession = require('../helpers/save-session')

function signIn (state, options) {
  if (!options || !options.username || !options.password) {
    Promise.reject(new Error('options.username and options.password is required'))
  }

  return request({
    url: state.url + '/session',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  })

  .then(function (response) {
    var data = JSON.parse(response.body)

    saveSession(state, data)
    return state.session.account.username
  })
}
