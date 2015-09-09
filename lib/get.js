module.exports = get

var getProp = require('lodash.get')
var setProp = require('lodash.set')

function get (state, path) {
  if (path === undefined) {
    return state.session.account
  }

  if (!Array.isArray(path)) {
    path = [path]
  }

  var results = path.map(function (p) {
    return getProp(state.session.account, p)
  })

  return results.length > 1 ? setProp(state.session.account, results) : results[0]
}
