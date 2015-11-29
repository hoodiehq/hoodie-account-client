module.exports = updateProfile

var merge = require('lodash.merge')

var Promise = require('../utils/promise')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.saveSession = require('../utils/save-session')
internals.serialise = require('../utils/serialise')

function updateProfile (state, options) {
  if (!options) {
    return Promise.reject(new Error('Please specify a profile property to update or add.'))
  }

  return internals.request({
    method: 'PATCH',
    url: state.url + '/session/account/profile',
    headers: {
      authorization: 'Bearer ' + state.session.id
    },
    body: internals.serialise('profile', options, state.session.account.profile.id)
  })

  .then(function () {
    merge(state.session.account.profile, options)
    internals.saveSession({
      cacheKey: state.cacheKey,
      session: state.session
    })

    return options
  })
}
