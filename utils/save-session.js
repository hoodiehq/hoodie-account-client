module.exports = saveSession

var localStorageWrapper = require('humble-localstorage')

function saveSession (options) {
  localStorageWrapper.setObject(options.cacheKey, options.session)
}
