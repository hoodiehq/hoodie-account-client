module.exports = find

var internals = module.exports.internals = {}
internals.request = require('../../../utils/request')
internals.deserialise = require('../../../utils/deserialise')

function find (state, id, options) {
  return internals.request({
    url: state.url + '/accounts/' + id + query(options),
    method: 'GET',
    headers: {
      authorization: 'Session ' + state.account.session.id
    }
  })

  .then(function (response) {
    return internals.deserialise(response.body, options)
  })
}

function query (options) {
  if (!options || options.include !== 'profile') {
    return ''
  }

  return '?include=profile'
}
