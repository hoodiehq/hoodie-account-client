module.exports = get

var getProp = require('lodash.get')

function get (state, basePath, path) {
  var baseObject = getProp(state.session, basePath)
  if (path === undefined) {
    return baseObject
  }

  if (!Array.isArray(path)) {
    path = [path]
  }

  var results = path.map(function (p) {
    return getProp(baseObject, p)
  })

  return results.length > 1 ? results : results[0]
}
