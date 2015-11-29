module.exports = signIn

var request = require('../utils/request')
var Promise = require('../utils/promise')
var saveSession = require('../utils/save-session')
var deserialise = require('../utils/deserialise')
var serialise = require('../utils/serialise')

function signIn (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  return request({
    url: state.url + '/session',
    method: 'PUT',
    body: serialise('session', options)
  })

  .then(function (response) {
    var data = deserialise(response.body)

    state.session = {
      id: data.id
    }
    state.session.account = { username: options.username }
    saveSession({
      cacheKey: state.cacheKey,
      session: state.session
    })

    return {
      sessionId: state.session.id,
      username: state.session.account.username
    }
  })
}