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
    ready: Promise.resolve(),
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
    },
    cache: {
      unset: simple.stub()
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

    t.is(state.account, undefined, 'unsets account')

    simple.restore()
  })

  .catch(t.error)
})

test('destroy() with request error', function (t) {
  t.plan(1)

  simple.mock(destroy.internals, 'request').rejectWith(new Error('Ooops'))

  destroy({
    ready: Promise.resolve(),
    account: {
      session: {}
    }
  })

  .then(t.fail.bind(t, 'must reject'))

  .catch(function () {
    t.pass('rejects with error')
  })
})
