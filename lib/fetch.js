module.exports = fetch

var request = require('../helpers/request')
var saveSession = require('../helpers/save-session')
var get = require('./get')
var deserialize = require('../helpers/deserialize')

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
    data = deserialize(data)

    // split the basePath into an array and grab the last item
    var type = basePath.split('.')
    type = type[type.length - 1]

    saveSession(state, data, type)

    return get(state, basePath, path)
  })
}
