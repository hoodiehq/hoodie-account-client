var test = require('tape')
var nock = require('nock')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signUpResponse = require('../fixtures/signup.json')
var signInResponse = require('../fixtures/signin.json')
var options = {
  username: signUpResponse.data.attributes.username,
  password: 'secret'
}

test('has "isSignedIn" method', function (t) {
  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.isSignedIn, 'function', 'has "isSignedIn()"')

  t.end()
})

test('returns correct signedIn state', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(200, JSON.stringify(signUpResponse))
    .put('/session')
    .reply(201, JSON.stringify(signInResponse))
    .delete('/session')
    .reply(204)

  account.signUp(options)

  .then(function () {
    return account.signIn(options)
  })

  .then(function () {
    t.is(account.isSignedIn(), true, 'returns true after signIn()')

    return account.signOut()
  })

  .then(function () {
    t.is(account.isSignedIn(), false, 'returns false after signOut()')
  })

  .catch(t.error)
})
