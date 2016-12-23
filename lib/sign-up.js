module.exports = signUp

var get = require('lodash/get')
var Promise = require('lie')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.deserialise = require('../utils/deserialise')
internals.serialise = require('../utils/serialise')

function signUp (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  return state.ready

  .then(function () {
    state.validate(options)

    if (options.profile) {
      throw new Error('SignUp with profile data not yet implemented. Please see https://github.com/hoodiehq/hoodie-account-client/issues/11.')
    }

    options.createdAt = get(state, 'account.createdAt')

    return internals.request({
      url: state.url + '/session/account',
      method: 'PUT',
      body: internals.serialise('account', options, get(state, 'account.id'))
    })

    .then(function (response) {
      var account = internals.deserialise(response.body, {
        include: 'profile'
      })

      state.emitter.emit('signup', account)

      return account
    })
  })
}
