var simple = require('simple-mock')
var test = require('tape')

var fetch = require('../../lib/profile-fetch')
var internals = fetch.internals

test('profileFetch', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith({})

  fetch({
    ready: Promise.resolve(),
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc4567'
      }
    },
    cache: {
      set: simple.stub().resolveWith()
    }
  }, 'path')

  .then(function () {
    t.deepEqual(internals.fetchProperties.lastCall.arg, {
      url: 'http://example.com/session/account/profile',
      sessionId: 'abc4567',
      path: 'path'
    }, 'calls fetchProperties with profile url')

    simple.restore()
    t.end()
  })
})

test('profileFetch with bogus path', function (t) {
  var state = {
    ready: Promise.resolve(),
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc4567'
      }
    },
    cache: {
      set: simple.stub()
    }
  }

  simple.mock(internals, 'fetchProperties').resolveWith({foo: 'bar'})

  fetch(state)

  .then(function (profileProperties) {
    t.deepEqual(internals.fetchProperties.lastCall.arg, {
      url: 'http://example.com/session/account/profile',
      sessionId: 'abc4567',
      path: undefined
    }, 'calls fetchProperties with profile url')

    t.deepEqual(state.account.profile, {foo: 'bar'}, 'sets state.account.profile')
    t.deepEqual(state.cache.set.lastCall.arg.profile, {foo: 'bar'}, 'update profile in local store')

    simple.restore()
    t.end()
  })

  .catch(function (error) {
    simple.restore()
    t.error(error)
    t.end()
  })
})

test('server side error', function (t) {
  t.plan(1)
  simple.mock(internals, 'fetchProperties').rejectWith(new Error())

  fetch({
    ready: Promise.resolve(),
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
