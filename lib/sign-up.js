module.exports = signUp

var Promise = require('lie')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.deserialise = require('../utils/deserialise')
internals.serialise = require('../utils/serialise')

function signUp (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  return state.setup

  .then(function () {
    return state.cache.get()
  })

  .then(function (cache) {
    state.validate(options)

    if (options.profile) {
      throw new Error('SignUp with profile data not yet implemented. Please see https://github.com/hoodiehq/hoodie-account-client/issues/11.')
    }

    options.createdAt = cache.createdAt

    return internals.request({
      url: state.url + '/session/account',
      method: 'PUT',
      body: internals.serialise('account', options, cache.id)
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
