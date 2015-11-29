var simple = require('simple-mock')
var test = require('tape')

var fetch = require('../../lib/fetch')
var internals = fetch.internals

test('fetch', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith({})

  fetch({
    baseUrl: 'http://example.com',
    session: {
      id: 'abc4567'
    }
  }, 'path')

  t.deepEqual(internals.fetchProperties.lastCall.arg, {
    url: 'http://example.com/session/account',
    bearerToken: 'abc4567',
    path: 'path'
  }, 'calls fetchProperties with account url')

  simple.restore()
  t.end()
})
