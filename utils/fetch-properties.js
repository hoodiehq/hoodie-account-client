module.exports = fetchProperties

var deserialise = require('./deserialise')
var getProperties = require('./get-properties')
var request = require('./request')

function fetchProperties (options) {
  return request({
    url: options.url,
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + options.bearerToken
    }
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    data = deserialise(data)

    return getProperties(data, options.path)
  })
}
