module.exports = add

var _ = require('lodash')
// var accountsFind = require('../accounts/find')
var accountsFindAll = require('../accounts/find-all')
var internals = {}
internals.request = require('../../../utils/request')
internals.deserialise = require('../../../utils/deserialise')

function add (state, options) {
  if (!options || !options.username) {
    return Promise.reject(new Error('options.username is required'))
  }

  // TODO: use accountsFind instead of accountsFindAll
  //       after updating accountsFind to match admin README doc
  // return accountsFind(state, {username: options.username})
  return accountsFindAll(state)
    .then(function (response) {
      var accountInfo = _.filter(
        response, {username: options.username})[0]
      if (!accountInfo) {
        var notFoundErr = new Error('account not found')
        notFoundErr.name = 'NotFoundError'
        throw notFoundErr
      }

      return internals.request({
        url: state.url + '/accounts/' + accountInfo.id + '/sessions',
        method: 'POST',
        headers: {
          authorization: 'Session ' + state.account.session.id
        }
      })
    }).then(function (response) {
      return internals.deserialise(response.body, {
        include: 'account'
      })
    })
}
