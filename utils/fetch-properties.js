module.exports = fetchProperties

var deserialise = require('./deserialise')
var getProperties = require('./get-properties')
var request = require('./request')

function fetchProperties (options) {
  return request({
    url: options.url,
    method: 'GET',
    headers: {
      authorization: 'Session ' + options.sessionId
    }
  })

  .then(function (response) {
    var data = deserialise(response.body)

    return getProperties(data, options.path)
  })
}
