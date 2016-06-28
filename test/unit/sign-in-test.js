var simple = require('simple-mock')
var test = require('tape')

var signIn = require('../../lib/sign-in')

test('signIn without options', function (t) {
  t.plan(1)

  signIn({})
    .then(t.fail.bind(t, 'must reject'))
    .catch(t.pass.bind(t, 'rejects with error'))
})

test('signIn without password', function (t) {
  t.plan(1)

  signIn({}, {
    username: 'username'
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('signIn without username', function (t) {
  t.plan(1)

  signIn({}, {
    password: 'password'
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('successful account.signIn(options)', function (t) {
  t.plan(6)

  var state = {
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    }
  }

  simple.mock(signIn.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(signIn.internals, 'serialise').returnWith('serialised')
  simple.mock(signIn.internals, 'deserialise').returnWith({
    id: 'Session123',
    account: {
      id: 'deserialise id',
      username: 'deserialise username'
    }
  })
  simple.mock(signIn.internals, 'saveAccount').callFn(function () {})

  signIn(state, {
    username: 'pat',
    password: 'secret'
  })

  .then(function (accountProperties) {
    t.deepEqual(signIn.internals.request.lastCall.arg, {
      method: 'PUT',
      url: 'http://example.com/session',
      body: 'serialised'
    })
    t.deepEqual(signIn.internals.deserialise.lastCall.arg, 'response body')
    t.deepEqual(signIn.internals.saveAccount.lastCall.arg, {
      cacheKey: 'cacheKey123',
      account: {
        session: {
          id: 'Session123'
        },
        id: 'deserialise id',
        username: 'deserialise username'
      }
    })

    t.assert(accountProperties, 'resolves with account object')
    t.equal(accountProperties.id, 'deserialise id', 'resolves with account.id')
    t.equal(accountProperties.username, 'deserialise username', 'resolves with account.username')

    simple.restore()
  })

  .catch(t.error)
})

test('signIn with request error', function (t) {
  t.plan(1)

  simple.mock(signIn.internals, 'request').rejectWith(new Error('Ooops'))

  signIn({})

  .then(t.fail.bind(t, 'must reject'))

  .catch(function (error) {
    t.is(typeof error, 'object', 'returns error object')
    simple.restore()
  })
})

// account.signIn() to emit `reauthenticate` event when unauthenticated

test('signIn with same username', function (t) {
  t.plan(2)

  var state = {
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    },
    account: {
      username: 'pat',
      session: {
        id: 'Session123'
      }
    }
  }

  simple.mock(signIn.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(signIn.internals, 'serialise').returnWith('serialised')
  simple.mock(signIn.internals, 'deserialise').returnWith({
    id: 'Session123'
  })
  simple.mock(signIn.internals, 'saveAccount').callFn(function () {})

  signIn(state, {
    username: 'pat',
    password: 'secret'
  })

  .then(function (accountProperties) {
    t.is(state.emitter.emit.callCount, 3, '3 Events emitted')
    t.is(state.emitter.emit.calls[1].arg, 'reauthenticate', 'Correct event emitted')
    simple.restore()
  })

  .catch(t.error)
})
