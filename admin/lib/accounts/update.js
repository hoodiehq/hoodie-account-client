module.exports = update

var request = require('../../../utils/request')
var deserialise = require('../../../utils/deserialise')
var serialise = require('../../../utils/serialise')

function update (state, id, account, options) {
  return request({
    url: state.url + '/accounts/' + id + query(options),
    method: 'PATCH',
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
