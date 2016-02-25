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
  t.plan(4)

  simple.mock(updateProfile.internals, 'request').resolveWith({
    statusCode: 204,
    body: null
  })
  simple.mock(updateProfile.internals, 'serialise').returnWith('profileJsonData')
  simple.mock(updateProfile.internals, 'saveAccount').callFn(function () {})

  updateProfile({
    cacheKey: 'cacheKey123',
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc1234'
      },
      profile: {
        foo: 'bar'
      }
    }
  }, {
    fullName: 'Docs Chicken'
  })

  .then(function (profile) {
    t.deepEqual(updateProfile.internals.request.lastCall.arg, {
      method: 'PATCH',
      url: 'http://example.com/session/account/profile',
      headers: {
        authorization: 'Bearer abc1234'
      },
      body: 'profileJsonData'
    })
    t.deepEqual(updateProfile.internals.saveAccount.lastCall.arg, {
      cacheKey: 'cacheKey123',
      account: {
        session: {
          id: 'abc1234'
        },
        profile: {
          foo: 'bar',
          fullName: 'Docs Chicken'
        }
      }
    })

    t.equal(profile.foo, 'bar', 'returns old property')
    t.equal(profile.fullName, 'Docs Chicken', 'returns new property')

    simple.restore()
  })

  .catch(t.error)
})

test('server side error', function (t) {
  t.plan(1)

  simple.mock(updateProfile.internals, 'request').rejectWith(new Error())

  updateProfile({
    cacheKey: 'cacheKey123',
    url: 'http://example.com',
    account: {
      session: {
        id: 'abc1234'
      },
      profile: {
        foo: 'bar'
      }
    }
  }, {
    fullName: 'Docs Chicken'
  })

  .then(t.fail.bind(t, 'must reject'))
  .catch(t.pass.bind(t, 'rejects with error'))
})
