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

    var account2 = new Account({
      url: 'http://localhost:3000',
      cacheKey: 'foo'
    })

    var account3 = new Account({
      url: 'http://localhost:3000',
      cacheKey: 'account'
    })

    return Promise.all([account1.ready, account2.ready, account3.ready])
  })

  .then(function (accounts) {
    t.is(accounts[0].isSignedIn(), true, 'is signed in if no cacheKey set')
    t.is(accounts[1].isSignedIn(), false, 'is signed out if cacheKey set to "foo"')
    t.is(accounts[2].isSignedIn(), true, 'is signed in if cacheKey set to "account"')
  })

  .catch(t.error)
})
