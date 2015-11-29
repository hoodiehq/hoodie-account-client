module.exports = profileGet

var get = require('lodash.get')

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')

function profileGet (state, path) {
  var profile = get(state, 'session.account.profile')
  return internals.getProperties(profile, path)
}
