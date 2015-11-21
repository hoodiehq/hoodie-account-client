module.exports = clearSession

var localStorageWrapper = require('humble-localstorage')

function clearSession (state) {
  localStorageWrapper.removeItem('_session')
  delete state.session
  delete state.account
  delete state.profile
}
