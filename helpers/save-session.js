module.exports = saveSession

var localStorageWrapper = require('humble-localstorage')
var merge = require('lodash.merge')
var get = require('lodash.get')
var getSession = require('./get-session')

function saveSession (state, data) {
  var storedSession = getSession(state)
  var normalizedData = {
    id: get(data, 'session.id') || get(data, 'id'),
    account: {
      username: get(data, 'username'),
      profile: get(data, 'profile')
    }
  }

  if (storedSession) {
    normalizedData = merge(storedSession, normalizedData)
  }

  localStorageWrapper.setObject('_session', normalizedData)

  var obj = {
    session: normalizedData
  }

  merge(state, obj)
}
