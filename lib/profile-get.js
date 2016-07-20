module.exports = profileGet

var get = require('lodash/get')

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')
internals.isSignedIn = require('./is-signed-in')

function profileGet (state, path) {
  if (!internals.isSignedIn(state)) {
    return undefined
  }
  var profile = get(state, 'account.profile')
  return internals.getProperties(profile, path) || {}
}
