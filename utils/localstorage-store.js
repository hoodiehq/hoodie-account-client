module.exports = LocalStorageStore

var localStorageWrapper = require('humble-localstorage')

function LocalStorageStore (key) {
  return {
    get: function get () {
      return localStorageWrapper.getObject(key)
    },
    set: function set (account) {
      localStorageWrapper.setObject(key, account)
    },
    unset: function unset () {
      localStorageWrapper.removeItem(key)
    }
  }
}
