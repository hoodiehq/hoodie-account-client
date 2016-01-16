module.exports = signIn

var Promise = require('lie')
var clone = require('lodash/clone')

var internals = module.exports.internals = {}
internals.deserialise = require('../utils/deserialise')
internals.request = require('../utils/request')
internals.saveAccount = require('../utils/save-account')
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

    // admins don’t have an account
    if (!data.account) {
      data.account = {
        username: options.username
      }
    }

    state.account = {
      username: data.account.username,
      session: {
        id: data.id
      }
    }

    if (data.account.id) {
      state.account.id = data.account.id
    }

    internals.saveAccount({
      cacheKey: state.cacheKey,
      account: state.account
    })

    state.emitter.emit('signin', clone(state.account))

    return clone(data.account)
  })
}
