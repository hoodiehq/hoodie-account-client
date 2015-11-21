var test = require('tape')

var deserialise = require('../../helpers/deserialise')

var options = {
  relationships: ['profile']
}
var response = require('../fixtures/signup.json')

test('throws error on non-JSON API response', function (t) {
  t.plan(1)

  t.throws(deserialise.bind(null, {}, options), 'throws an error')
})

test('returns data from JSON API response', function (t) {
  t.plan(3)

  var data = deserialise(response, options)

  t.is(data.id, response.data.id, 'returns correct id')
  t.is(data.username, response.data.attributes.username, 'returns correct attribute')
  t.is(data.profile.id, response.data.relationships.profile.data.id, 'returns correct relationship')
})

