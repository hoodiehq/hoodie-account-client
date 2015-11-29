module.exports = remove

var request = require('../../../utils/request')
var find = require('./find')

function remove (state, id, options) {
  var account

  return find(state, id, options)

  .then(function (_account) {
    account = _account
  })

  .then(function () {
    return request({
      url: state.url + '/accounts/' + id,
      method: 'DELETE',
      headers: {
        authorization: 'Bearer ' + state.session.id
      }
    })
  })

  .then(function (response) {
    return account
  })
}
