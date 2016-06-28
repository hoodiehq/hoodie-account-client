module.exports = update

var clone = require('lodash/clone')
var merge = require('lodash/merge')
var omit = require('lodash/omit')

var Promise = require('lie')

var internals = module.exports.internals = {}
internals.deserialise = require('../utils/deserialise')
internals.request = require('../utils/request')
internals.saveAccount = require('../utils/save-account')
internals.serialise = require('../utils/serialise')

function update (state, options) {
  if (!options) {
    return Promise.reject(new Error('Specify an account property to update'))
  }

  return internals.request({
    method: 'PATCH',
    url: state.url + '/session/account',
    headers: {
      authorization: 'Session ' + state.account.session.id
    },
    body: internals.serialise('account', options, state.account.id)
  })

  .then(function (response) {
    // when a username changes, the session ID gets recalculated, as it’s based
    // on the username, see npm.im/couchdb-calculate-session-id. In that case
    // the server sets x-set-session with the new session id.
    if (response.headers['x-set-session']) {
      state.account.session.id = response.headers['x-set-session']
    }

    merge(state.account, omit(options, ['password']))
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
