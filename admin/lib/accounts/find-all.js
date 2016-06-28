module.exports = findAll

var internals = module.exports.internals = {}
internals.request = require('../../../utils/request')
internals.deserialise = require('../../../utils/deserialise')

function findAll (state, options) {
  return internals.request({
    method: 'GET',
    url: state.url + '/accounts' + query(options),
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
