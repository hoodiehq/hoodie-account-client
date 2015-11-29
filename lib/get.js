module.exports = accountGet

var get = require('lodash.get')

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')

function accountGet (state, path) {
  var account = get(state, 'session.account')
  return internals.getProperties(account, path)
}
