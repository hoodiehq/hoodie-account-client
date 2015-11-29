module.exports = getProperties

var getProp = require('lodash.get')
var setProp = require('lodash.set')

function getProperties (state, basePath, path) {
  var baseObject = getProp(state.session, basePath)
  if (path === undefined) {
    return baseObject
  }

  if (Array.isArray(path)) {
    return path.reduce(function (properties, path) {
      return setProp(properties, path, getProp(baseObject, path))
    }, {})
  }

  return getProp(baseObject, path)
}
