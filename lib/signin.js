module.exports = signIn

var request = require('../helpers/request')
var Promise = require('../helpers/promise')
var saveSession = require('../helpers/save-session')
var deserialize = require('../helpers/deserialize')
var serialize = require('../helpers/serialize')

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
    body: JSON.stringify(serialize('session', options))
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    data = deserialize(data)

    saveSession(state, { id: data.id })
    saveSession(state, { username: options.username }, 'account')

    return {
      sessionId: state.session.id,
      username: state.session.account.username
    }
  })
}
