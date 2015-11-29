module.exports = fetchProperties

var request = require('./request')
var saveSession = require('./save-session')
var get = require('./get-properties')
var deserialise = require('./deserialise')

function fetchProperties (state, basePath, path) {
  return request({
    url: state.url + '/session/' + basePath.replace(/\./, '/'), // replace '.' in path with '/'
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + state.session.id
    }
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    data = deserialise(data)

    // split the basePath into an array and grab the last item
    var type = basePath.split('.')
    type = type[type.length - 1]

    saveSession(state, data, type)

    return get(state, basePath, path)
  })
}
