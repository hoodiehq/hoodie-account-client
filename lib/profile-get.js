module.exports = profileGet

var set = require('lodash/set')

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')
internals.fetchProperties = require('../utils/fetch-properties')

function profileGet (state, path, options) {
  if (typeof path === 'object' && !Array.isArray(path)) {
    options = path
    path = undefined
  }

  return state.setup

  .then(state.cache.get)

  .then(function (cachedProperties) {
    if (!cachedProperties.session) {
      return internals.getProperties(cachedProperties.profile || {}, path)
    }

    if (options && options.local) {
      return internals.getProperties(cachedProperties.profile || {}, path)
    }

    return internals.fetchProperties({
      url: state.url + '/session/account/profile',
      sessionId: cachedProperties.session.id,
      path: path
    })

    .then(function (result) {
      if (typeof path === 'string') {
        set(cachedProperties.profile, path, result)
      } else {
        cachedProperties.profile = result
      }

      // reauthenticate an expired session
      if (cachedProperties.session.invalid) {
        delete cachedProperties.session.invalid
        state.emitter.emit('reauthenticate')
      }

      return state.cache.set(cachedProperties)

      .then(function () {
        return internals.getProperties(cachedProperties.profile || {}, path)
      })
    })

    .catch(function (error) {
      if (error.statusCode !== 401) {
        throw error
      }

      cachedProperties.session.invalid = true
      state.emitter.emit('unauthenticate')

      return state.cache.set(cachedProperties)

      .then(function () {
        throw error
      })
    })
  })
}
