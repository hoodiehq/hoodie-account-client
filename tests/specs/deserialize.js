var test = require('tape')

var deserialize = require('../../helpers/deserialize')

var options = {
  relationships: ['profile']
}
var response = {
  'data': {
    'id': 'def678',
    'type': 'account',
    'attributes': {
      'username': 'jane-doe'
    },
    'relationships': {
      'profile': {
        'links': {
          'related': 'https://example.com/session/account/profile'
        },
        'data': {
          'id': 'def678-profile',
          'type': 'accountProfile'
        }
      }
    }
  },
  'included': [
    {
      'id': 'def678-profile',
      'type': 'accountProfile',
      'attributes': {
        'fullName': 'Jane Doe'
      }
    }
  ]
}

test('throws error on non-JSON API response', function (t) {
  t.plan(1)

  t.throws(deserialize.bind(null, {}, options), 'throws an error')
})

test('returns data from JSON API response', function (t) {
  t.plan(3)

  var data = deserialize(response, options)

  t.is(data.id, response.data.id, 'returns correct id')
  t.is(data.username, response.data.attributes.username, 'returns correct attribute')
  t.is(data.profile.id, response.data.relationships.profile.data.id, 'returns correct relationship')
})

