var simple = require('simple-mock')
var test = require('tape')

var signOut = require('../../lib/sign-out')
var hookMock = simple.stub().callbackWith()

test('signOut()', function (t) {
  t.plan(3)

  simple.mock(signOut.internals, 'request').resolveWith({
    statusCode: 204,
    body: null
  })

  var state = {
    hook: hookMock,
    setup: Promise.resolve(),
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    },
    cache: {
      set: simple.stub().resolveWith(),
      unset: simple.stub().resolveWith(),
      get: simple.stub().resolveWith({
        id: 'user567',
        session: {
          id: 'abc4567'
        },
        username: 'pat'
      })
    }
  }

  signOut(state)

  .then(function (result) {
    t.deepEqual(signOut.internals.request.lastCall.arg, {
      method: 'DELETE',
      url: 'http://example.com/session',
      headers: {
        authorization: 'Session abc4567'
      }
    })

    t.equal(state.cache.set.callCount, 1)
    t.isNot(state.cache.set.lastCall.arg.id, 'user567', 'resets account')

    simple.restore()
  })

  .catch(t.error)
})

test('signOut() with request error', function (t) {
  t.plan(1)

  simple.mock(signOut.internals, 'request').rejectWith(new Error('Ooops'))

  signOut({
    hook: hookMock,
    setup: Promise.resolve(),
    cache: {
      get: simple.stub().resolveWith({
        session: {}
      })
    },
    emitter: {
      emit: simple.stub()
    }
  })

  .then(t.fail.bind(t, 'must reject'))

  .catch(function () {
    t.pass('rejects with error')
  })
})

test('signOut() without being signed in', function (t) {
  t.plan(2)

  signOut({
    hook: hookMock,
    setup: Promise.resolve(),
    cache: {
      get: simple.stub().resolveWith({})
    },
    emitter: {
      emit: simple.stub()
    }
  })

  .then(t.fail.bind(t, 'must reject'))

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
    t.equal(
      error.message,
      'UnauthenticatedError: Not signed in',
      'error not an UnauthenticatedError'
    )
  })
})
