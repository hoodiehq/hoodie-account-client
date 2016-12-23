module.exports = hasInvalidSession

var get = require('lodash/get')

function hasInvalidSession (state) {
  if (!state.account) {
    throw new Error('account.hasInvalidSession() not yet accessible, wait for account.ready to resolve')
  }

  return get(state, 'account.session.invalid')
}
