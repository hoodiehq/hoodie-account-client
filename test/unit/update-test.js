var simple = require('simple-mock')
var test = require('tape')

var update = require('../../lib/update')

test('update without change', function (t) {
  t.plan(1)

  update()
    .then(t.fail.bind(t, 'must reject'))
    .catch(t.pass.bind(t, 'rejects with error'))
})

test('update with change', function (t) {
  t.plan(6)

  var state = {
    cacheKey: 'cacheKey123',
    url: 'http://example.com',
    emitter: {
      emit: simple.stub()
    },
    account: {
      username: 'bakingpies',
      session: {
        id: 'abc1234'
      }
    }
  }

  simple.mock(update.internals, 'request').resolveWith({
    statusCode: 204,
    body: null
  })
  simple.mock(update.internals, 'deserialise').returnWith(state.account.session)
  simple.mock(update.internals, 'serialise').returnWith('jsonData')
  simple.mock(update.internals, 'saveAccount').callFn(function () {})

  update(state, {
    username: 'treetrunks'
  })

  .then(function (account) {
    t.deepEqual(update.internals.request.calls[0].arg, {
      method: 'PATCH',
      url: 'http://example.com/session/account',
      headers: {
        authorization: 'Bearer abc1234'
      },
      body: 'jsonData'
    })
    t.deepEqual(update.internals.request.calls[1].arg, {
      method: 'PUT',
      url: 'http://example.com/session',
      body: 'jsonData'
    })
    t.deepEqual(update.internals.saveAccount.lastCall.arg, {
      cacheKey: 'cacheKey123',
      account: {
        username: 'treetrunks',
        session: {
          id: 'abc1234'
        }
      }
    })

    t.equal(account.username, 'treetrunks', 'returns new property')

    t.is(state.emitter.emit.callCount, 1, '1 Event emitted')
    t.is(state.emitter.emit.lastCall.arg, 'update', 'Correct event emitted')
    simple.restore()
  })

  .catch(t.error)
})

test('server side error', function (t) {
  t.plan(1)

  var state = {
    cacheKey: 'cacheKey123',
    url: 'http://example.com',
    emitter: {
      emit: simple.stub()
    },
    account: {
      username: 'bakingpies',
      session: {
        id: 'abc1234'
      }
    }
  }

  simple.mock(update.internals, 'request').rejectWith(new Error())

  update(state, {
    username: 'treetrunks'
  })

  .then(function (account) {
    t.fail.bind(t, 'must reject')
    simple.restore()
  })
  .catch(t.pass.bind(t, 'rejects with error'))
})

