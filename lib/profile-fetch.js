module.exports = fetch

var internals = module.exports.internals = {}
internals.fetchProperties = require('../utils/fetch-properties')

function fetch (state, path) {
  return internals.fetchProperties(state, 'account.profile', path)
}
