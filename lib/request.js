module.exports = request

var Promise = require('lie')

var internals = module.exports.internals = {}
internals.deserialise = require('../utils/deserialise')
internals.request = require('../utils/request')
internals.serialise = require('../utils/serialise')

function request (state, options) {
  if (!options || !options.type) {
    return Promise.reject(new Error('account.request: options.type must be passed'))
  }

  return internals.request({
    url: state.url + '/requests',
    method: 'POST',
    body: internals.serialise('request', options)
  })

  .then(function (response) {
    var data = internals.deserialise(response.body)
    state.emitter.emit(options.type, data)

    return data
  })
}
