module.exports = accountGet

var internals = module.exports.internals = {}
internals.getProperties = require('../utils/get-properties')

function accountGet (state, path) {
  if (!state.account) {
    throw new Error('account.get() not yet accessible, wait for account.ready to resolve')
  }

  return internals.getProperties(state.account, path)
}
