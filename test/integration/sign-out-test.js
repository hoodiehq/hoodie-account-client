var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'

test('sign out', function (t) {
  t.plan(1)

  // simulate signed in user
  store.clear()
  store.setObject('account', {
    username: 'sam',
    session: {
      id: 'abc4567'
    }
  })

  // mock server response for sign out request
  nock(baseURL)
    .delete('/session')
    .reply(204)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  account.on('signout', function () {
    t.is(account.isSignedIn(), false)
  })
  account.signOut().catch(t.error)
})
