module.exports = saveAccount

var localStorageWrapper = require('humble-localstorage')

function saveAccount (options) {
  localStorageWrapper.setObject(options.cacheKey, options.account)
}
