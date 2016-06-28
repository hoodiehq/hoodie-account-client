module.exports = remove

var internals = module.exports.internals = {}
internals.request = require('../../../utils/request')
internals.find = require('./find')

function remove (state, id, options) {
  var account

  return internals.find(state, id, options)

  .then(function (_account) {
    account = _account
  })

  .then(function () {
    return internals.request({
      url: state.url + '/accounts/' + id,
      method: 'DELETE',
      headers: {
        authorization: 'Session ' + state.account.session.id
      }
    })
  })

  .then(function () {
    state.accountsEmitter.emit('remove', account)
    state.accountsEmitter.emit('change', 'remove', account)

    return account
  })
}
