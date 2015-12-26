var nock = require('nock')
var test = require('tape')

var signInResponse = require('../fixtures/signin.json')

test('new Account(options) defaults to "account" cacheKey', function (t) {
  t.plan(3)

  var Account = require('../../index')

  var account = new Account({
    url: 'http://localhost:3000'
  })

  nock('http://localhost:3000')
    .put('/session')
    .reply(201, JSON.stringify(signInResponse))

  return account.signIn({
    username: 'pat',
    password: 'secret'
  })

  .then(function () {
    var account1 = new Account({
      url: 'http://localhost:3000'
    })

    t.is(account1.isSignedIn(), true, 'is signed in if no cacheKey set')

    var account2 = new Account({
      url: 'http://localhost:3000',
      cacheKey: 'foo'
    })

    t.is(account2.isSignedIn(), false, 'is signed out if cacheKey set to "foo"')

    var account3 = new Account({
      url: 'http://localhost:3000',
      cacheKey: 'account'
    })

    t.is(account3.isSignedIn(), true, 'is signed in if cacheKey set to "account"')
  })

  .catch(t.error)
})
