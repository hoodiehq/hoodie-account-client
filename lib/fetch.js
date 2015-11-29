module.exports = fetch

var request = require('../utils/request')
var saveSession = require('../utils/save-session')
var get = require('./get')
var deserialise = require('../utils/deserialise')

function fetch (state, basePath, path) {
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
