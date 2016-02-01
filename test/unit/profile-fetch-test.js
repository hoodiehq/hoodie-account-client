var simple = require('simple-mock')
var test = require('tape')

var fetch = require('../../lib/profile-fetch')
var internals = fetch.internals

test('profileFetch', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith({})

  fetch({
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc4567'
      }
    }
  }, 'path')

  t.deepEqual(internals.fetchProperties.lastCall.arg, {
    url: 'http://example.com/session/account/profile',
    bearerToken: 'abc4567',
    path: 'path'
  }, 'calls fetchProperties with profile url')

  simple.restore()
  t.end()
})
