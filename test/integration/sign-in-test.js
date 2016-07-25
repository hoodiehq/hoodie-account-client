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
  t.plan(12)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  nock(baseURL)
    .put('/session?include=account.profile')
    .reply(201, signInResponse)

    .delete('/session')
    .reply(204)

  account.signIn(options)

  .then(function (signInResult) {
    t.pass('signes in')
    t.is(signInResult.username, 'chicken@docs.com')

    var storeAccount = store.getObject('account')

    t.deepEqual(storeAccount, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: {
        id: 'sessionid123'
      },
      profile: {
        fullName: 'Docs Chicken',
        favoriteClothing: 'Hoodie'
      }
    }, 'stores account with id with session')
    t.deepEqual(account.get(), {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: {
        id: 'sessionid123'
      },
      profile: {
        fullName: 'Docs Chicken',
        favoriteClothing: 'Hoodie'
      }
    }, '.get() returns account with session')

    return account.signOut()
  })

  .then(function (signOutResult) {
    t.pass('signes out')

    t.is(signOutResult.username, 'chicken@docs.com')
    t.is(signOutResult.profile.fullName, 'Docs Chicken')

    var storeAccount = store.getObject('account')

    t.is(storeAccount, null, 'removes acocunt from store')

    t.ok(/^[a-z0-9]{7}$/.test(account.id), 'generates new account.id')
    t.isNot(account.id, 'abc4567', 'new id is not same as old id')

    storeAccount = store.getObject('account')
    t.ok(/^[a-z0-9]{7}$/.test(storeAccount.id), 'stores new id')

    t.deepEqual(account.get(), {id: storeAccount.id}, '.get() returns new account id')
  })

  .catch(t.error)
})
