module.exports = saveSession

var localStorageWrapper = require('humble-localstorage')
var merge = require('lodash.merge')
var getSession = require('./get-session')

/**
 * state.session = {
 *   id: 'session123',
 *   account: {
 *     id: 'account456',
 *     username: 'docsChicken',
 *     profile: {
 *       fullName: 'Docs Chicken'
 *     }
 *   }
 * }
 */

function saveSession (state, data, type) {
  var storedSession = getSession(state) || {}

  switch (type) {
    case 'account':
      data = merge(storedSession, { account: data })
      break
    case 'profile':
      data = merge(storedSession, {account: {profile: data}})
      break
    default:
      data = merge(storedSession, data)
      break
  }

  localStorageWrapper.setObject('_session', data)

  var obj = {
    session: data
  }

  merge(state, obj)
}
