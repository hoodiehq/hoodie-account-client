var simple = require('simple-mock')
var test = require('tape')

var updateProfile = require('../../lib/profile-update')

test('updateProfile without change', function (t) {
  t.plan(1)

  updateProfile()
    .then(t.fail.bind(t, 'must reject'))
    .catch(t.pass.bind(t, 'rejects with error'))
})

test('updateProfile with change', function (t) {
  t.plan(7)

  simple.mock(updateProfile.internals, 'request').resolveWith({
    statusCode: 204,
    body: null
  })
  simple.mock(updateProfile.internals, 'serialise').returnWith('profileJsonData')

  var state = {
    setup: Promise.resolve(),
    cacheKey: 'cacheKey123',
    url: 'http://example.com',
    emitter: {
      emit: simple.stub()
    },
    cache: {
      set: simple.stub(),
      get: simple.stub().resolveWith({
        session: {
          id: 'abc1234'
        },
        profile: {
          foo: 'bar'
        }
      })
    }
  }

  updateProfile(state, {
    fullName: 'Docs Chicken'
  })

  .then(function (profile) {
    t.deepEqual(updateProfile.internals.request.lastCall.arg, {
      method: 'PATCH',
      url: 'http://example.com/session/account/profile',
      headers: {
        authorization: 'Session abc1234'
      },
      body: 'profileJsonData'
    })
    t.deepEqual(state.cache.set.lastCall.arg, {
      session: {
        id: 'abc1234'
      },
      profile: {
        foo: 'bar',
        fullName: 'Docs Chicken'
      }
    })

    t.equal(profile.foo, 'bar', 'returns old property')
    t.equal(profile.fullName, 'Docs Chicken', 'returns new property')

    t.equal(state.emitter.emit.callCount, 1, '1 Event emitted')
    t.equal(state.emitter.emit.lastCall.arg, 'update', 'Correct event emitted')
    t.deepEqual(state.emitter.emit.lastCall.args[1].profile, { foo: 'bar', fullName: 'Docs Chicken' })

    simple.restore()
  })

  .catch(t.error)
})

test('server side error', function (t) {
  t.plan(1)

  simple.mock(updateProfile.internals, 'request').rejectWith(new Error())

  updateProfile({
    setup: Promise.resolve(),
    cacheKey: 'cacheKey123',
    url: 'http://example.com',
    cache: {
      get: simple.stub().resolveWith({
        session: {
          id: 'abc1234'
        },
        profile: {
          foo: 'bar'
        }
      })
    }
  }, {
    fullName: 'Docs Chicken'
  })

  .then(t.fail.bind(t, 'must reject'))
  .catch(t.pass.bind(t, 'rejects with error'))
})
