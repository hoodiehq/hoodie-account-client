module.exports = updateProfile

var merge = require('lodash.merge')

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
      authorization: 'Bearer ' + state.session.id
    },
    body: serialise('profile', options, state.session.account.profile.id)
  })

  .then(function () {
    merge(state.session.account.profile, options)
    saveSession({
      cacheKey: state.cacheKey,
      session: state.session
    })

    return options
  })
}
