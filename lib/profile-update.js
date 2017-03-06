module.exports = updateProfile

var clone = require('lodash/clone')
var merge = require('lodash/merge')

var Promise = require('lie')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.serialise = require('../utils/serialise')

function updateProfile (state, options) {
  if (!options) {
    return Promise.reject(new Error('Please specify a profile property to update or add.'))
  }

  return state.setup

  .then(function () {
    return state.cache.get()
  })

  .then(function (cache) {
    return internals.request({
      method: 'PATCH',
      url: state.url + '/session/account/profile',
      headers: {
        authorization: 'Session ' + cache.session.id
      },
      body: internals.serialise('profile', options, cache.id + '-profile')
    })

    .then(function () {
      if (!cache.profile) {
        cache.profile = {}
      }

      merge(cache.profile, options)
      state.cache.set(cache)

      state.emitter.emit('update', clone(cache))

      return cache.profile
    })

    .catch(function (error) {
      if (error.statusCode === 401) {
        cache.session.invalid = true
        state.emitter.emit('unauthenticate')

        state.cache.set(cache)
      }

      throw error
    })
  })
}
