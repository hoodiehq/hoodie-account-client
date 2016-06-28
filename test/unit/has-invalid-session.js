var test = require('tape')

var hasInvalidSession = require('../../lib/has-invalid-session')

test('test if session has invalid property', function (t) {
  t.is(hasInvalidSession({
    account: {
      username: 'sam',
      session: {
        invalid: true
      }
    }
  }), true, 'returns true')

  t.end()
})

test('test if invalid property is not present in session', function (t) {
  t.is(hasInvalidSession({
    account: {
      session: {
        id: 'Session123'
      }
    }
  }), undefined, 'returns undefined')

  t.end()
})
