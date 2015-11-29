module.exports = getSession

var localStorageWrapper = require('humble-localstorage')

function getSession (options) {
  return localStorageWrapper.getObject(options.cacheKey)
}
