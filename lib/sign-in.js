module.exports = signIn

var Promise = require('../utils/promise')

var internals = module.exports.internals = {}
internals.deserialise = require('../utils/deserialise')
internals.request = require('../utils/request')
internals.saveSession = require('../utils/save-session')
internals.serialise = require('../utils/serialise')

function signIn (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  return internals.request({
    url: state.url + '/session',
    method: 'PUT',
    body: internals.serialise('session', options)
  })

  .then(function (response) {
    var data = internals.deserialise(response.body)

    state.session = {
      id: data.id
    }
    state.session.account = { username: options.username }
    internals.saveSession({
      cacheKey: state.cacheKey,
      session: state.session
    })

    return {
      sessionId: state.session.id,
      username: state.session.account.username
    }
  })
}
