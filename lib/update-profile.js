module.exports = updateProfile

var request = require('../helpers/request')
var Promise = require('../helpers/promise')
var saveSession = require('../helpers/save-session')
var serialize = require('../helpers/serialize')

function updateProfile (state, options) {
  if (!options) {
    Promise.reject(new Error('Please specify a profile property to update or add.'))
  }

  return request({
    url: state.url + '/session/account/profile',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + state.session.id
    },
    body: JSON.stringify(serialize('profile', options, state.session.account.profile.id))
  })

  .then(function () {
    saveSession(state, options, 'profile')

    return options
  })
}
