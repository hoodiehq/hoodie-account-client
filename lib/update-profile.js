module.exports = updateProfile

var request = require('../utils/request')
var Promise = require('../utils/promise')
var saveSession = require('../utils/save-session')
var serialise = require('../utils/serialise')

function updateProfile (state, options) {
  if (!options) {
    return Promise.reject(new Error('Please specify a profile property to update or add.'))
  }

  return request({
    url: state.url + '/session/account/profile',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + state.session.id
    },
    body: JSON.stringify(serialise('profile', options, state.session.account.profile.id))
  })

  .then(function () {
    saveSession(state, options, 'profile')

    return options
  })
}
