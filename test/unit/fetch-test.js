var simple = require('simple-mock')
var test = require('tape')

var fetch = require('../../lib/fetch')
var internals = fetch.internals

test('fetch', function (t) {
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
    url: 'http://example.com/session/account',
    sessionId: 'abc4567',
    path: 'path'
  }, 'calls fetchProperties with account url')

  simple.restore()
  t.end()
})

test('fetch without state', function (t) {
  t.plan(1)

  fetch({
    url: 'http://example.com'
  }, 'path')

  .then(t.fail.bind(t, 'Must reject'))
  .catch(function (error) {
    t.equal(error.name, 'UnauthenticatedError', 'rejects with UnauthenticatedError error')
  })
})

test('fetch with undefined path', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith({})

  fetch({
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc45678'
      }
    }
  })

  t.deepEqual(internals.fetchProperties.lastCall.arg, {
    url: 'http://example.com/session/account',
    sessionId: 'abc45678',
    path: undefined
  }, 'calls fetchProperties with account url and non-string path')

  simple.restore()
  t.end()
})

test('fetch when no internal state available', function (t) {
  t.plan(1)

  fetch({
    url: 'example.com',
    account: {
      session: {
        id: 'abc4567'
      }
    }
  }, 'path')

  .then(t.fail.bind(t, 'Must reject'))
  .catch(function (error) {
    t.equal(error.name, 'ConnectionError', 'rejects with ConnectionError error')
  })
})
