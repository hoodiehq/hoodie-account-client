module.exports = signUp

var request = require('../helpers/request')
var Promise = require('../helpers/promise')
var saveSession = require('../helpers/save-session')

function signUp (state, options) {
  if (!options || !options.username || !options.password) {
    Promise.reject(new Error('options.username and options.password is required'))
  }

  if (state.validate) {
    state.validate(options)
  }

  return request({
    url: state.url + '/session/account',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  })

  .then(function (response) {
    var data = JSON.parse(response.body)

    saveSession(state, data)
    return data.username
  })
}
