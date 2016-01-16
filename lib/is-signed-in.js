module.exports = isSignedIn

var get = require('lodash/get')

function isSignedIn (state) {
  return get(state, 'account.session') !== undefined
}
