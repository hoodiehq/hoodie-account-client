module.exports = isSignedIn

var get = require('lodash/get')

function isSignedIn (state) {
  if (!state.account) {
    throw new Error('account.isSignedIn() not yet accessible, wait for account.ready to resolve')
  }

  return get(state, 'account.session') !== undefined
}
