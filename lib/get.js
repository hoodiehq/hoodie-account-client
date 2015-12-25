module.exports = accountGet

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')

function accountGet (state, path) {
  return internals.getProperties(state.account, path)
}
