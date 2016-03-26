var store = require('humble-localstorage')

var nock = require('nock')
var test = require('tape')

var AccountAdmin = require('../../admin/index')

var baseURL = 'http://localhost:3000'
var signInResponse = require('../fixtures/admin-signin.json')

var options = {
  username: 'chicken@docs.com',
  password: 'secret'
}

test('sign in', function (t) {
  store.clear()
  t.plan(6)

  var account = new AccountAdmin({
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

    var storeAccount = store.getObject('account_admin')

    t.deepEqual(storeAccount, {
      username: 'chicken@docs.com',
      session: {
        id: 'sessionid123'
      }
    }, 'stores account with id with session')

    return account.signOut()
  })

  .then(function (signOutResult) {
    t.pass('signs out')

    t.is(signOutResult.username, 'chicken@docs.com')

    var storeAccount = store.getObject('account_admin')

    t.is(storeAccount, null, 'removes account from store')
  })

  .catch(t.error)
})
