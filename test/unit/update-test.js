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
  t.plan(4)

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
    body: null,
    headers: {}
  })
  simple.mock(update.internals, 'deserialise').returnWith(state.account.session)
  simple.mock(update.internals, 'serialise').returnWith('jsonData')
  simple.mock(update.internals, 'saveAccount').callFn(function () {})

  update(state, {
    password: 'newsecret'
  })

  .then(function (account) {
    t.deepEqual(update.internals.request.calls[0].arg, {
      method: 'PATCH',
      url: 'http://example.com/session/account',
      headers: {
        authorization: 'Session abc1234'
      },
      body: 'jsonData'
    })
    t.deepEqual(update.internals.saveAccount.lastCall.arg, {
      cacheKey: 'cacheKey123',
      account: {
        username: 'bakingpies',
        session: {
          id: 'abc1234'
        }
      }
    })

    t.is(state.emitter.emit.callCount, 1, '1 Event emitted')
    t.is(state.emitter.emit.lastCall.arg, 'update', 'Correct event emitted')
    simple.restore()
  })

  .catch(t.error)
})

test('update with change causing new session', function (t) {
  t.plan(5)

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
    body: null,
    headers: {
      'x-set-session': 'newsession5678'
    }
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
        authorization: 'Session abc1234'
      },
      body: 'jsonData'
    })
    t.deepEqual(update.internals.saveAccount.lastCall.arg, {
      cacheKey: 'cacheKey123',
      account: {
        username: 'treetrunks',
        session: {
          id: 'newsession5678'
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
