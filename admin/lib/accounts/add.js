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
    return deserialise(response.body, options)
  })
}

function query (options) {
  if (!options || !options.include === 'profile') {
    return ''
  }

  return '?include=profile'
}
