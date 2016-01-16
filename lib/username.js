module.exports = username

var get = require('lodash/get')

function username (state) {
  return get(state, 'account.username')
}
