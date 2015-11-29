module.exports = profileGet

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')

function profileGet (state, path) {
  return internals.getProperties(state, 'profile', path)
}
