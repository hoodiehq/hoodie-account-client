var simple = require('simple-mock')
var test = require('tape')

var signOut = require('../../lib/sign-out')

test('signOut()', function (t) {
  t.plan(3)

  simple.mock(signOut.internals, 'request').resolveWith({
    statusCode: 204,
    body: null
  })
  simple.mock(signOut.internals, 'clearSession').callFn(function () {})

  var state = {
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    account: {
      session: {
        id: 'abc4567'
      },
      username: 'pat'
    },
    emitter: {
      emit: simple.stub()
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
    t.deepEqual(signOut.internals.clearSession.lastCall.arg, {
      cacheKey: 'cacheKey123'
    })

    t.is(state.account, undefined, 'unsets account')

    simple.restore()
  })

  .catch(t.error)
})

test('signOut() with request error', function (t) {
  t.plan(1)

  simple.mock(signOut.internals, 'request').rejectWith(new Error('Ooops'))

  signOut({
    account: {
      session: {}
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
    account: {},
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
