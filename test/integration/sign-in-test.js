var store = require('humble-localstorage')

var clone = require('lodash/clone')
var nock = require('nock')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signInResponse = clone(require('../fixtures/signin.json'))

var options = {
  username: 'chicken@docs.com',
  password: 'secret'
}

test('sign in', function (t) {
  store.clear()
  t.plan(11)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  nock(baseURL)
    .put('/session')
    .reply(201, signInResponse)

    .delete('/session')
    .reply(204)

  account.signIn(options)

  .then(function (signInResult) {
    t.pass('signs in')
    t.is(signInResult.username, 'chicken@docs.com')

    var storeAccount = store.getObject('account')

    t.deepEqual(storeAccount, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: {
        id: 'sessionid123'
      }
    }, 'stores account with id with session')

    account.get({local: true})

    .then(function (cache) {
      t.deepEqual(cache, {
        id: 'abc4567',
        username: 'chicken@docs.com',
        session: {
          id: 'sessionid123'
        }
      }, 'session is cached')
    })

    return account.signOut()
  })

  .then(function (signOutResult) {
    t.pass('signs out')

    t.is(signOutResult.username, 'chicken@docs.com')

    var storeAccount = store.getObject('account')

    t.ok(storeAccount.id, 'sets new id in account store')
    t.isNot(storeAccount.id, signOutResult.id, 'resets account in store')

    t.isNot(account.id, 'abc4567', 'new id is not same as old id')

    storeAccount = store.getObject('account')
    t.ok(/^[a-z0-9]{7}$/.test(storeAccount.id), 'stores new id')

    account.get('id')

    .then(function (id) {
      t.is(id, storeAccount.id, '.get("id") resolves with new account id')
    })
  })

  .catch(t.error)
})

test('prevent sign-in when already signed in', function (t) {
  store.clear()
  t.plan(1)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  nock(baseURL)
    .put('/session')
    .reply(201, signInResponse)

  account.signIn(options)

  .then(function (signInResult) {
    return account.signIn({
      username: 'fox@docs.com',
      password: 'secret'
    })
  })

  .then(function () {
    t.fail('Sign in must fail when already signed in')
  })

  .catch(function (error) {
    t.is(error.message, 'You must sign out before signing in')
  })
})
