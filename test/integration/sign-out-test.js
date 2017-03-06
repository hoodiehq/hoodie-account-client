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
    id: 'user1234',
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
    id: 'user1234'
  })

  account.on('signout', function () {
    account.get('session')

    .then(function (session) {
      t.notOk(session)
    })
  })
  account.signOut().catch(t.error)
})
