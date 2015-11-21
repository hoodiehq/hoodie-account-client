module.exports = signIn

var request = require('../helpers/request')
var Promise = require('../helpers/promise')
var saveSession = require('../helpers/save-session')
var deserialise = require('../helpers/deserialise')
var serialise = require('../helpers/serialise')

function signIn (state, options) {
  if (!options || !options.username || !options.password) {
    Promise.reject(new Error('options.username and options.password is required'))
  }

  return request({
    url: state.url + '/session',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    },
    body: JSON.stringify(serialise('session', options))
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    data = deserialise(data)

    saveSession(state, { id: data.id })
    saveSession(state, { username: options.username }, 'account')

    return {
      sessionId: state.session.id,
      username: state.session.account.username
    }
  })
}
