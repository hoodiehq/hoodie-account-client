module.exports = getProperties

var get = require('lodash/get')
var set = require('lodash/set')

function getProperties (baseObject, path) {
  if (path === undefined) {
    return baseObject
  }

  if (Array.isArray(path)) {
    return path.reduce(function (properties, path) {
      return set(properties, path, get(baseObject, path))
    }, {})
  }

  return get(baseObject, path)
}
