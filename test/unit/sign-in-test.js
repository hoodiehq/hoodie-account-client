var simple = require('simple-mock')
var test = require('tape')

var signIn = require('../../lib/sign-in')
var hookMock = simple.stub().callFn(function (name, options, callback) {
  return callback(options)
})

test('signIn without options', function (t) {
  t.plan(1)

  signIn({
    hook: hookMock,
    setup: Promise.resolve()
  })
    .then(t.fail.bind(t, 'must reject'))
    .catch(t.pass.bind(t, 'rejects with error'))
})

test('signIn without password', function (t) {
  t.plan(1)

  signIn({
    hook: hookMock,
    setup: Promise.resolve()
  }, {
    username: 'username'
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('signIn without username', function (t) {
  t.plan(1)

  signIn({
    hook: hookMock,
    setup: Promise.resolve()
  }, {
    password: 'password'
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('sgnIn with username & password', function (t) {
  t.plan(6)

  var state = {
    hook: hookMock,
    setup: Promise.resolve(),
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    },
    cache: {
      set: simple.stub(),
      get: simple.stub().resolveWith({})
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
    t.deepEqual(state.cache.set.lastCall.arg, {
      session: {
        id: 'Session123'
      },
      id: 'deserialise id',
      username: 'deserialise username'
    })

    t.assert(accountProperties, 'resolves with account object')
    t.equal(accountProperties.id, 'deserialise id', 'resolves with account.id')
    t.equal(accountProperties.username, 'deserialise username', 'resolves with account.username')

    simple.restore()
  })

  .catch(t.error)
})

test('signIn with token', function (t) {
  t.plan(6)

  var state = {
    hook: hookMock,
    setup: Promise.resolve(),
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    },
    cache: {
      set: simple.stub(),
      get: simple.stub().resolveWith({})
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

  signIn(state, {
    token: 'token123'
  })

  .then(function (accountProperties) {
    t.deepEqual(signIn.internals.request.lastCall.arg, {
      method: 'PUT',
      url: 'http://example.com/session',
      body: 'serialised'
    })
    t.deepEqual(signIn.internals.deserialise.lastCall.arg, 'response body')
    t.deepEqual(state.cache.set.lastCall.arg, {
      session: {
        id: 'Session123'
      },
      id: 'deserialise id',
      username: 'deserialise username'
    })

    t.assert(accountProperties, 'resolves with account object')
    t.equal(accountProperties.id, 'deserialise id', 'resolves with account.id')
    t.equal(accountProperties.username, 'deserialise username', 'resolves with account.username')

    simple.restore()
  })

  .catch(t.error)
})

test('signIn with token should trigger signin', function (t) {
  t.plan(1)

  var state = {
    hook: hookMock,
    setup: Promise.resolve(),
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    },
    cache: {
      set: simple.stub(),
      get: simple.stub().resolveWith({})
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

  signIn(state, {
    token: 'token123'
  })

  .then(function (accountProperties) {
    t.deepEqual(state.emitter.emit.lastCall.arg, 'signin')

    simple.restore()
  })

  .catch(t.error)
})

test('signIn with request error', function (t) {
  t.plan(1)

  simple.mock(signIn.internals, 'request').rejectWith(new Error('Ooops'))

  signIn({
    hook: hookMock,
    setup: Promise.resolve(),
    cache: {
      get: simple.stub().resolveWith({})
    }
  }, {
    username: 'foo',
    password: 'secret'
  })

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
    hook: hookMock,
    setup: Promise.resolve(),
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    },
    cache: {
      set: simple.stub(),
      get: simple.stub().resolveWith({
        username: 'pat',
        session: {
          id: 'Session123'
        }
      })
    }
  }

  simple.mock(signIn.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(signIn.internals, 'serialise').returnWith('serialised')
  simple.mock(signIn.internals, 'deserialise').returnWith({
    id: 'Session123'
  })

  signIn(state, {
    username: 'pat',
    password: 'secret'
  })

  .then(function (accountProperties) {
    t.is(state.emitter.emit.callCount, 1, '1 Event emitted')
    t.is(state.emitter.emit.calls[0].arg, 'reauthenticate', 'Correct event emitted')
    simple.restore()
  })

  .catch(t.error)
})
