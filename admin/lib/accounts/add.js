module.exports = add

var internals = module.exports.internals = {}
internals.request = require('../../../utils/request')
internals.deserialise = require('../../../utils/deserialise')
internals.serialise = require('../../../utils/serialise')

function add (state, account, options) {
  return internals.request({
    url: state.url + '/accounts' + query(options),
    method: 'POST',
    headers: {
      authorization: 'Session ' + state.account.session.id
    },
    body: internals.serialise('account', account)
  })

  .then(function (response) {
    var account = internals.deserialise(response.body, options)

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
