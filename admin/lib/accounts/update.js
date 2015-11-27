module.exports = update

var request = require('../../../helpers/request')
var deserialise = require('../../../helpers/deserialise')
var serialise = require('../../../helpers/serialise')

function update (state, id, account, options) {
  return request({
    url: state.url + '/accounts/' + id + query(options),
    method: 'PATCH',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + state.session.id,
      'Content-Type': 'application/vnd.api+json'
    },
    body: JSON.stringify(serialise('account', account))
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    return deserialise(data, options)
  })
}

function query (options) {
  if (!options || !options.include === 'profile') {
    return ''
  }

  return '?include=profile'
}
