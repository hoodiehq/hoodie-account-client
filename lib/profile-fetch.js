module.exports = profileFetch

var get = require('lodash/get')
var set = require('lodash/set')

var internals = module.exports.internals = {}
internals.fetchProperties = require('../utils/fetch-properties')
internals.saveAccount = require('../utils/save-account')

function profileFetch (state, path) {
  return internals.fetchProperties({
    url: state.url + '/session/account/profile',
    sessionId: get(state, 'account.session.id'),
    path: path
  })

  .then(function (properties) {
    if (typeof path === 'string') {
      set(state.account.profile, path, properties)
    } else {
      set(state.account, 'profile', properties)
    }

    internals.saveAccount({
      cacheKey: state.cacheKey,
      account: state.account
    })

    return properties
  })

  .catch(function (error) {
    if (error.statusCode === 401) {
      state.account.session.invalid = true
      state.emitter.emit('unauthenticate')

      internals.saveAccount({
        cacheKey: state.cacheKey,
        account: state.account
      })
    }

    throw error
  })
}
