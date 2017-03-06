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

    return Promise.all([account1.get('session'), account2.get('session'), account3.get('session')])
  })

  .then(function (results) {
    t.ok(results[0], 'is signed in if no cacheKey set')
    t.notOk(results[1], 'is signed out if cacheKey set to "foo"')
    t.ok(results[2], 'is signed in if cacheKey set to "account"')
  })

  .catch(t.error)
})
