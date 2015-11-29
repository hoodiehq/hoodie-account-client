var simple = require('simple-mock')
var test = require('tape')

var updateProfile = require('../../lib/update-profile')

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
  simple.mock(updateProfile.internals, 'saveSession').callFn(function () {})

  updateProfile({
    cacheKey: 'cacheKey123',
    url: 'http://example.com',
    session: {
      id: 'abc1234',
      account: {
        profile: {
          foo: 'bar'
        }
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
    t.deepEqual(updateProfile.internals.saveSession.lastCall.arg, {
      cacheKey: 'cacheKey123',
      session: {
        id: 'abc1234',
        account: {
          profile: {
            foo: 'bar',
            fullName: 'Docs Chicken'
          }
        }
      }
    })

    t.equal(profile.foo, 'bar', 'returns old property')
    t.equal(profile.fullName, 'Docs Chicken', 'returns new property')

    simple.restore()
  })

  .catch(t.error)
})
