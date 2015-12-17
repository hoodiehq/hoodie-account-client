module.exports = signIn

var Promise = require('../utils/promise')
var clone = require('lodash.clone')

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
    var data = internals.deserialise(response.body, {
      include: 'account'
    })

    state.session = {
      id: data.id
    }

    // admins don’t have an account
    if (!data.account) {
      data.account = {
        username: options.username
      }
    }

    state.session.account = {
      username: data.account.username
    }

    if (data.account.id) {
      state.session.account.id = data.account.id
    }

    internals.saveSession({
      cacheKey: state.cacheKey,
      session: state.session
    })

    state.emitter.emit('signin', {
      id: data.account.id,
      username: data.account.username
    })

    return clone(state.session)
  })
}
