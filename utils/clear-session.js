module.exports = clearSession

var localStorageWrapper = require('humble-localstorage')

function clearSession (state) {
  localStorageWrapper.removeItem(state.cacheKey)
  delete state.session
}
