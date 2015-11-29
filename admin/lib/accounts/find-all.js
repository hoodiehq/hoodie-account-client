module.exports = findAll

var request = require('../../../utils/request')
var deserialise = require('../../../utils/deserialise')

function findAll (state, options) {
  return request({
    url: state.url + '/accounts' + query(options),
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
