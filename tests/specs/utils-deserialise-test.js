var test = require('tape')

var deserialise = require('../../utils/deserialise')

var options = {
  include: 'profile'
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
  t.deepEqual(data.profile, {
    email: 'chicken@docs.com',
    fullName: 'Docs Chicken'
  }, 'returns correct relationship')
})

test('accounts with profile response', function (t) {
  var accountsWithProfileResponse = require('../fixtures/accounts-with-profile.json')
  var accountsWithProfileReturn = require('../fixtures/accounts-with-profile-return.json')

  var data = deserialise(accountsWithProfileResponse, {
    include: 'profile'
  })

  t.deepEqual(data, accountsWithProfileReturn, 'returns right data')

  t.end()
})
