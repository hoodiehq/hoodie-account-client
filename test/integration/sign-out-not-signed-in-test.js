var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'

test('sign out without being signed in', function (t) {
  t.plan(2)

  // simulate user who has not yet signed in
  store.clear()

  var account = new Account({
    url: baseURL
  })

  account.signOut().catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
    t.equal(
      error.message,
      'UnauthenticatedError: Not signed in',
      'error not an UnauthenticatedError'
    )
  })
})
