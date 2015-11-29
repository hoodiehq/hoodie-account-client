module.exports = findAll

var request = require('../../../utils/request')
var deserialise = require('../../../utils/deserialise')

function findAll (state, options) {
  return request({
    url: state.url + '/accounts' + query(options),
    method: 'GET',
    headers: {
      authorization: 'Bearer ' + state.session.id
    }
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
