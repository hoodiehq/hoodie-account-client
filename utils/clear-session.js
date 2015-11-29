module.exports = clearSession

var localStorageWrapper = require('humble-localstorage')

function clearSession (options) {
  localStorageWrapper.removeItem(options.cacheKey)
}
