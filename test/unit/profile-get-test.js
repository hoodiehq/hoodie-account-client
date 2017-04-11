var simple = require('simple-mock')
var test = require('tape')

var profileGet = require('../../lib/profile-get')
var internals = profileGet.internals

test('profileGet() without session', function (t) {
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({})
      }
    }
  }
  profileGet(state)

  .then(function (result) {
    t.deepEqual(result, {})
    t.end()
  })

  .catch(t.error)
})

test('profileGet() with session', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith({
    foo: 'bar'
  })
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123'
          }
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  profileGet(state)

  .then(function (result) {
    t.deepEqual(result, {
      foo: 'bar'
    })
    t.deepEqual(state.cache.set.lastCall.args[0], {
      profile: {
        foo: 'bar'
      },
      session: {
        id: 'session123'
      }
    })

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('profileGet() and reauthenticate on invalid session', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith({
    foo: 'bar'
  })
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123',
            invalid: true
          }
        })
      },
      set: simple.stub().resolveWith()
    },
    emitter: {
      emit: simple.stub()
    }
  }

  profileGet(state)

  .then(function (result) {
    t.deepEqual(result, {
      foo: 'bar'
    })
    t.deepEqual(state.cache.set.lastCall.arg, {
      profile: {
        foo: 'bar'
      },
      session: {
        id: 'session123'
      }
    })
    t.is(state.emitter.emit.callCount, 1)
    t.deepEqual(state.emitter.emit.lastCall.arg, 'reauthenticate')

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('profileGet() with session and server error', function (t) {
  simple.mock(internals, 'fetchProperties').rejectWith(new Error('oops'))
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123'
          }
        })
      }
    }
  }

  profileGet(state)

  .then(function () {
    t.error('should reject')
  })

  .catch(function (error) {
    t.is(error.message, 'oops')
    t.end()
  })
})

test('profileGet() with session and 401 error', function (t) {
  var error = new Error('unauthenticated')
  error.statusCode = 401
  simple.mock(internals, 'fetchProperties').rejectWith(error)
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123'
          }
        })
      },
      set: simple.stub().resolveWith()
    },
    emitter: {
      emit: simple.stub()
    }
  }

  profileGet(state)

  .then(function () {
    t.error('should reject')
  })

  .catch(function (error) {
    t.is(error.message, 'unauthenticated')
    t.deepEqual(state.cache.set.lastCall.arg, {
      session: {
        id: 'session123',
        invalid: true
      }
    })
    t.is(state.emitter.emit.callCount, 1)

    t.deepEqual(state.emitter.emit.lastCall.args, ['unauthenticate'])
    t.end()
  })
})

test('profileGet({local: true}) with session', function (t) {
  simple.mock(internals, 'fetchProperties').callFn(function () {
    t.error('should not fetch from remote')
  })
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123'
          },
          profile: {
            foo: 'bar'
          }
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  profileGet(state, {local: true})

  .then(function (result) {
    t.deepEqual(result, {
      foo: 'bar'
    })

    simple.restore()
    t.end()
  })

  .catch(t.error)
})
