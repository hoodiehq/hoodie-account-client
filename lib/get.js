module.exports = accountGet

var set = require('lodash/set')
var merge = require('lodash/merge')

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')
internals.fetchProperties = require('../utils/fetch-properties')

function accountGet (state, path, options) {
  if (typeof path === 'object' && !Array.isArray(path)) {
    options = path
    path = undefined
  }

  return state.setup

  .then(state.cache.get)

  .then(function (cachedProperties) {
    if ((options && options.local) || !cachedProperties.session || pathIsLocalOnly(path)) {
      return internals.getProperties(cachedProperties, path)
    }

    return internals.fetchProperties({
      url: state.url + '/session/account',
      sessionId: cachedProperties.session.id,
      path: path
    })

    .then(function (result) {
      if (typeof path === 'string') {
        set(cachedProperties, path, result)
      } else if (Array.isArray(path)) {
        merge(cachedProperties, result, {
          session: cachedProperties.session
        })
      } else {
        result.session = cachedProperties.session
        cachedProperties = result
      }

      // reauthenticate an expired session
      if (cachedProperties.session.invalid) {
        delete cachedProperties.session.invalid
        state.emitter.emit('reauthenticate')
      }

      return state.cache.set(cachedProperties)

      .then(function () {
        return internals.getProperties(cachedProperties, path)
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

function pathIsLocalOnly (path) {
  if (!path) {
    return false
  }

  if (typeof path === 'string') {
    return isLocalPath(path)
  }

  return path.filter(isLocalPath).length === path.length
}

function isLocalPath (path) {
  return /^(id|session)\b/.test(path)
}
