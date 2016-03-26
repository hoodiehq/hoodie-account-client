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

test('profileFetch with bogus path', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith({})

  fetch({
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc4567'
      }
    }
  })

  t.deepEqual(internals.fetchProperties.lastCall.arg, {
    url: 'http://example.com/session/account/profile',
    bearerToken: 'abc4567',
    path: undefined
  }, 'calls fetchProperties with profile url')

  simple.restore()
  t.end()
})

test('server side error', function (t) {
  t.plan(1)
  simple.mock(internals, 'fetchProperties').rejectWith(new Error())

  fetch({
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc4567'
      }
    }
  }, 'path')

  .then(t.fail.bind(t, 'must reject'))
  .catch(t.pass.bind(t, 'rejects with error'))
})
