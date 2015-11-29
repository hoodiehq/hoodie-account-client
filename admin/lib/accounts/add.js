module.exports = add

var request = require('../../../utils/request')
var deserialise = require('../../../utils/deserialise')
var serialise = require('../../../utils/serialise')

function add (state, account, options) {
  return request({
    url: state.url + '/accounts' + query(options),
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + state.session.id
    },
    body: serialise('account', account)
  })

  .then(function (response) {
    var account = deserialise(response.body, options)

    state.accountsEmitter.emit('add', account)
    state.accountsEmitter.emit('change', 'add', account)

    return account
  })
}

function query (options) {
  if (!options || !options.include === 'profile') {
    return ''
  }

  return '?include=profile'
}
