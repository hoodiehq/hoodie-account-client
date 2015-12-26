module.exports = signUp

var clone = require('lodash.clone')
var get = require('lodash.get')
var Promise = require('lie')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.deserialise = require('../utils/deserialise')
internals.serialise = require('../utils/serialise')

function signUp (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  try {
    state.validate.call(this, options)
  } catch (error) {
    return Promise.reject(error)
  }

  if (options.profile) {
    return Promise.reject(new Error('SignUp with profile data not yet implemented. Please see https://github.com/hoodiehq/hoodie-client-account/issues/11.'))
  }

  return internals.request({
    url: state.url + '/session/account',
    method: 'PUT',
    body: internals.serialise('account', options, get(state, 'account.id'))
  })

  .then(function (response) {
    state.account = internals.deserialise(response.body, {
      include: 'profile'
    })

    state.emitter.emit('signup', state.account)

    return clone(state.account)
  })
}
