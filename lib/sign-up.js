module.exports = signUp

var Promise = require('../utils/promise')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.deserialise = require('../utils/deserialise')
internals.serialise = require('../utils/serialise')

function signUp (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  try {
    state.validate(options)
  } catch (error) {
    return Promise.reject(error)
  }

  if (options.profile) {
    return Promise.reject(new Error('SignUp with profile data not yet implemented. Please see https://github.com/hoodiehq/hoodie-client-account/issues/11.'))
  }

  return internals.request({
    url: state.url + '/session/account',
    method: 'PUT',
    body: internals.serialise('account', options)
  })

  .then(function (response) {
    var data = internals.deserialise(response.body, {
      include: 'profile'
    })

    state.emitter.emit('signup', {
      id: data.id,
      username: data.username
    })

    return {
      id: data.id,
      username: data.username
    }
  })
}
