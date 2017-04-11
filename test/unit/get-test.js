var simple = require('simple-mock')
var test = require('tape')

var get = require('../../lib/get')
var internals = get.internals

test('get() without session', function (t) {
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          foo: 'bar'
        })
      }
    }
  }

  get(state)

  .then(function (result) {
    t.deepEqual(result, {foo: 'bar'})

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get("foo") without session', function (t) {
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          foo: 'bar'
        })
      }
    }
  }

  get(state, 'foo')

  .then(function (result) {
    t.is(result, 'bar', 'returns value for foo property')

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get() with session', function (t) {
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
          },
          foo: 'bar'
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  get(state)

  .then(function (result) {
    t.deepEqual(result, {
      foo: 'bar',
      session: {
        id: 'session123'
      }
    })
    t.deepEqual(state.cache.set.lastCall.args[0], {
      foo: 'bar',
      session: {
        id: 'session123'
      }
    })

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get("foo") with session', function (t) {
  simple.mock(internals, 'fetchProperties').resolveWith('bar')
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

  get(state, 'foo')

  .then(function (result) {
    t.is(result, 'bar')
    t.deepEqual(state.cache.set.lastCall.args[0], {
      foo: 'bar',
      session: {
        id: 'session123'
      }
    })

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get("id") with session', function (t) {
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
          id: 'account123'
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  get(state, 'id')

  .then(function (result) {
    t.is(result, 'account123')

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get("session") with session', function (t) {
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
          id: 'account123'
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  get(state, 'session')

  .then(function (result) {
    t.deepEqual(result, { id: 'session123' })

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get("session.invalid") with session', function (t) {
  simple.mock(internals, 'fetchProperties').callFn(function () {
    t.error('should not fetch from remote')
  })
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123',
            invalid: true
          },
          id: 'account123'
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  get(state, 'session.invalid')

  .then(function (result) {
    t.is(result, true)

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get(["id", "session.id"]) with session', function (t) {
  simple.mock(internals, 'fetchProperties').callFn(function () {
    t.error('should not fetch from remote')
  })
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123',
            invalid: true
          },
          id: 'account123'
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  get(state, ['id', 'session.id'])

  .then(function (result) {
    t.deepEqual(result, {
      id: 'account123',
      session: {
        id: 'session123'
      }
    })

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get() and reauthenticate on invalid session', function (t) {
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

  get(state)

  .then(function (result) {
    t.deepEqual(result, {
      foo: 'bar',
      session: {
        id: 'session123'
      }
    })
    t.deepEqual(state.cache.set.lastCall.arg, {
      foo: 'bar',
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

test('get() with session and server error', function (t) {
  simple.mock(internals, 'fetchProperties').rejectWith(new Error('oops'))
  var state = {
    setup: Promise.resolve(),
    cache: {
      get: function () {
        return Promise.resolve({
          session: {
            id: 'session123'
          },
          foo: 'bar'
        })
      }
    }
  }

  get(state)

  .then(function () {
    t.error('should reject')
  })

  .catch(function (error) {
    t.is(error.message, 'oops')
    t.end()
  })
})

test('get() with session and 401 error', function (t) {
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
          },
          foo: 'bar'
        })
      },
      set: simple.stub().resolveWith()
    },
    emitter: {
      emit: simple.stub()
    }
  }

  get(state)

  .then(function () {
    t.error('should reject')
  })

  .catch(function (error) {
    t.is(error.message, 'unauthenticated')
    t.deepEqual(state.cache.set.lastCall.arg, {
      session: {
        id: 'session123',
        invalid: true
      },
      foo: 'bar'
    })
    t.is(state.emitter.emit.callCount, 1)

    t.deepEqual(state.emitter.emit.lastCall.args, ['unauthenticate'])
    t.end()
  })
})

test('get({local: true}) with session', function (t) {
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
          id: 'account123'
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  get(state, {local: true})

  .then(function (result) {
    t.deepEqual(result, {
      session: {
        id: 'session123'
      },
      id: 'account123'
    })

    simple.restore()
    t.end()
  })

  .catch(t.error)
})

test('get("foo", {local: true}) with session', function (t) {
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
          id: 'account123',
          foo: 'bar'
        })
      },
      set: simple.stub().resolveWith()
    }
  }

  get(state, 'foo', {local: true})

  .then(function (result) {
    t.is(result, 'bar')

    simple.restore()
    t.end()
  })

  .catch(t.error)
})
