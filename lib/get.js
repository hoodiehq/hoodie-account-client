module.exports = get

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')

function get (state, path) {
  return internals.getProperties(state, 'account', path)
}
