var test = require('tape')

var deserialise = require('../../utils/deserialise')

var options = {
  include: 'profile'
}
var signInResponse = require('../fixtures/signin.json')
var signUpResponse = require('../fixtures/signup.json')
var accountsWithProfileResponse = require('../fixtures/accounts-with-profile.json')
var accountsWithProfileReturn = require('../fixtures/accounts-with-profile-return.json')
var sessionsWithProfile = require('../fixtures/sessions-with-profile.json')
var sessionsWithProfileReturn = require('../fixtures/sessions-with-profile-return.json')
var accounts = require('../fixtures/accounts-with-missing-includes.json')
var accountsReturn = require('../fixtures/accounts-return.json')

test('throws error on non-JSON API response', function (t) {
  t.throws(deserialise.bind(null, {}, options), 'throws an error')

  t.end()
})

test('returns data from sign up response', function (t) {
  var data = deserialise(signUpResponse, options)

  t.is(data.id, signUpResponse.data.id, 'returns correct id')
  t.is(data.username, signUpResponse.data.attributes.username, 'returns correct attribute')
  t.deepEqual(data.profile, {
    email: 'chicken@docs.com',
    fullName: 'Docs Chicken'
  }, 'returns correct relationship')

  t.end()
})

test('deserialise sign in response', function (t) {
  var data = deserialise(signInResponse, {
    include: 'account'
  })

  t.deepEqual(data, {
    id: 'sessionid123',
    account: {
      id: 'abc4567',
      username: 'chicken@docs.com'
    }
  }, 'returns correct data')

  t.end()
})

test('accounts with profile response', function (t) {
  var data = deserialise(accountsWithProfileResponse, {
    include: 'profile'
  })

  t.deepEqual(data, accountsWithProfileReturn, 'returns right data')

  t.end()
})

test('Session with account->profile', function (t) {
  var data = deserialise(sessionsWithProfile, {
    include: 'account.profile'
  })

  t.deepEqual(data, sessionsWithProfileReturn, 'returns right data')

  t.end()
})

test('accounts with missing includes', function (t) {
  var data = deserialise(accounts, options)

  t.deepEqual(data, accountsReturn, 'returns right data')

  t.end()
})
