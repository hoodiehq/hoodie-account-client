var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'

// prepared test for https://github.com/hoodiehq/camp/issues/9
// 1. replace `test.skip` with just `test`
// 2. run `$ node test/integration/sign-out-test.js`
// 3. you should see "not ok 1 should be equal"
// 4. remove all comments and commit change with "test: signout event timing hoodiehq/camp#9"
test.skip('sign out', function (t) {
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
