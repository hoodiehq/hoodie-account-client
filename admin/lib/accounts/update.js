module.exports = update

var merge = require('lodash.merge')

var find = require('./find')

var request = require('../../../utils/request')
var serialise = require('../../../utils/serialise')

function update (state, id, change, options) {
  var account

  return find(state, id)

  .then(function (_account) {
    account = _account

    return request({
      url: state.url + '/accounts/' + id + query(options),
      method: 'PATCH',
      headers: {
        authorization: 'Bearer ' + state.session.id
      },
      body: serialise('account', change)
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
  if (!options || !options.include === 'profile') {
    return ''
  }

  return '?include=profile'
}
