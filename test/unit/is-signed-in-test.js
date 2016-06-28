var test = require('tape')

var isSignedIn = require('../../lib/is-signed-in')

test('isSignedIn without session', function (t) {
  t.is(isSignedIn({}), false, 'returns false')

  t.end()
})

test('isSignedIn with session', function (t) {
  t.is(isSignedIn({
    account: {
      session: {
        id: 'Session123'
      }
    }
  }), true, 'returns true')

  t.end()
})
