module.exports = update

var merge = require('lodash/merge')

var internals = module.exports.internals = {}
internals.find = require('./find')
internals.request = require('../../../utils/request')
internals.serialise = require('../../../utils/serialise')

function update (state, id, change, options) {
  var account

  return internals.find(state, id, options)

  .then(function (_account) {
    account = _account

    return internals.request({
      url: state.url + '/accounts/' + id + query(options),
      method: 'PATCH',
      headers: {
        authorization: 'Session ' + state.account.session.id
      },
      body: internals.serialise('account', change)
    })
  })

  .then(function (response) {
    delete change.password
    merge(account, change)

    state.accountsEmitter.emit('update', account)
    state.accountsEmitter.emit('change', 'update', account)

    return account
  })
}

function query (options) {
  if (!options || options.include !== 'profile') {
    return ''
  }

  return '?include=profile'
}
