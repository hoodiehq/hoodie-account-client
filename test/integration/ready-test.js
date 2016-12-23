var nock = require('nock')
var simple = require('simple-mock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

test('account.ready', function (t) {
  store.clear()
  var account = new Account({
    url: 'http://localhost:3000'
  })

  t.throws(function () {
    account.username
  }, 'account.username not accessible before account.ready resolves')

  t.throws(function () {
    account.id
  }, 'account.id not accessible before account.ready resolves')

  t.throws(function () {
    account.isSignedIn()
  }, 'account.isSignedIn() not accessible before account.ready resolves')

  t.throws(function () {
    account.hasInvalidSession()
  }, 'account.hasInvalidSession() not accessible before account.ready resolves')

  t.throws(function () {
    account.get()
  }, 'account.get() not accessible before account.ready resolves')

  t.throws(function () {
    account.profile.get()
  }, 'account.profile.get() not accessible before account.ready resolves')

  account.ready.then(function (account_) {
    t.equal(account, account_, 'resolves with account instance')
    t.ok(account.id)

    t.end()
  })
})

test('async APIs before .ready resolves', function (t) {
  nock('http://example.com')
    .delete('/session')
    .reply(204)

  // simulate signed in user
  store.clear()
  store.setObject('account', {
    username: 'sam',
    id: 'user1234',
    session: {
      id: 'abc4567'
    }
  })

  var account = new Account({
    url: 'http://example.com',
    id: 'user1234'
  })

  account.on('signout', function () {
    t.is(account.isSignedIn(), false)
    t.end()
  })
  account.signOut().catch(t.error)
})

test('async APIs before .ready rejects', function (t) {
  nock('http://example.com')
    .delete('/session')
    .reply(204)

  // simulate signed in user
  store.clear()
  store.setObject('account', {
    username: 'sam',
    id: 'user1234',
    session: {
      id: 'abc4567'
    }
  })

  var account = new Account({
    url: 'http://example.com',
    id: 'user1234',
    cache: {
      get: simple.stub().rejectWith(new Error('Oops'))
    }
  })

  account.signOut()

  .then(t.fail)

  .catch(function (error) {
    t.is(error.message, 'Error while initialising: Oops')
    t.end()
  })
})
