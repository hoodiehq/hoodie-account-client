module.exports = getSession

var localStorageWrapper = require('humble-localstorage')

function getSession (state) {
  if (!state.session) {
    state.session = localStorageWrapper.getObject('_session')
  }

  return state.session
}
