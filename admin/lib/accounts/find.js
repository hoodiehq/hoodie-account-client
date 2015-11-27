module.exports = find

var request = require('../../../helpers/request')
var deserialise = require('../../../helpers/deserialise')

function find (state, id, options) {
  return request({
    url: state.url + '/accounts/' + id + query(options),
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + state.session.id
    }
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
