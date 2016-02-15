module.exports = update

var merge = require('lodash/merge')
var clone = require('lodash/clone')

var Promise = require('lie')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.saveAccount = require('../utils/save-account')
internals.serialise = require('../utils/serialise')

function update (state, options) {
  if (!options) {
    return Promise.reject(new Error('Please specify an account property to update.'))
  }

  return internals.request({
    method: 'PATCH',
    url: state.url + '/session/account',
    headers: {
      authorization: 'Bearer ' + state.account.session.id
    },
    body: internals.serialise('account', options, state.account.id)
  })

  .then(function () {
    merge(state.account, options)
    internals.saveAccount({
      cacheKey: state.cacheKey,
      account: state.account
    })

    state.emitter.emit('update', clone(state.account))

    return state.account
  })

  .catch(function (error) {
    if (error.statusCode === 401) {
      state.account.session.invalid = true
      state.emitter.emit('unauthenticate')

      internals.saveAccount({
        cacheKey: state.cacheKey,
        account: state.account
      })
    }

    throw error
  })
}
