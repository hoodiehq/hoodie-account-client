module.exports = updateProfile

var merge = require('lodash.merge')

var Promise = require('lie')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.saveAccount = require('../utils/save-account')
internals.serialise = require('../utils/serialise')

function updateProfile (state, options) {
  if (!options) {
    return Promise.reject(new Error('Please specify a profile property to update or add.'))
  }

  return internals.request({
    method: 'PATCH',
    url: state.url + '/session/account/profile',
    headers: {
      authorization: 'Bearer ' + state.account.session.id
    },
    body: internals.serialise('profile', options, state.account.profile.id)
  })

  .then(function () {
    merge(state.account.profile, options)
    internals.saveAccount({
      cacheKey: state.cacheKey,
      account: state.account
    })

    return state.account.profile
  })
}
