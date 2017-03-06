var simple = require('simple-mock')
var test = require('tape')

var destroy = require('../../lib/destroy')

test('destroy()', function (t) {
  t.plan(3)

  simple.mock(destroy.internals, 'request').resolveWith({
    statusCode: 204,
    body: null
  })

  var state = {
    setup: Promise.resolve(),
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    },
    cache: {
      unset: simple.stub(),
      get: simple.stub().resolveWith({
        session: {
          id: 'abc4567'
        },
        username: 'pat'
      })
    }
  }

  destroy(state)

  .then(function (result) {
    t.deepEqual(destroy.internals.request.lastCall.arg, {
      method: 'DELETE',
      url: 'http://example.com/session/account',
      headers: {
        authorization: 'Session abc4567'
      }
    })
    t.deepEqual(state.cache.unset.callCount, 1)

    t.is(state.cache.unset.callCount, 1, 'unsets account')

    simple.restore()
  })

  .catch(t.error)
})

test('destroy() with request error', function (t) {
  t.plan(1)

  simple.mock(destroy.internals, 'request').rejectWith(new Error('Ooops'))

  destroy({
    setup: Promise.resolve(),
    cache: {
      get: simple.stub().resolveWith({
        session: {}
      })
    }
  })

  .then(t.fail.bind(t, 'must reject'))

  .catch(function () {
    t.pass('rejects with error')
  })
})
