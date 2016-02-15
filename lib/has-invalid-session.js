module.exports = hasInvalidSession

var get = require('lodash/get')

function hasInvalidSession (state) {
  return get(state, 'account.session.invalid')
}
