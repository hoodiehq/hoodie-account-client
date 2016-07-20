var simple = require('simple-mock')
var test = require('tape')

var get = require('../../lib/profile-get')
var internals = get.internals

test('profileGet', function (t) {
  simple.mock(internals, 'getProperties').returnWith('foo')
  simple.mock(internals, 'isSignedIn').returnWith(true)
  var result = get({
    account: {
      profile: 'profile'
    }
  }, 'path')

  t.deepEqual(internals.getProperties.lastCall.args, [
    'profile',
    'path'
  ], 'calls utils.getProperties with "profile" basepath')
  t.is(result, 'foo', 'returns result of getProperties')

  simple.restore()
  t.end()
})

test('profileGet with empty profile', function (t) {
  simple.mock(internals, 'getProperties').returnWith(undefined)
  simple.mock(internals, 'isSignedIn').returnWith(true)
  var result = get({
    account: {}
  })

  t.deepEqual(internals.getProperties.lastCall.args, [
    undefined,
    undefined
  ], 'calls utils.getProperties with "profile" basepath')
  t.same(result, {}, 'returns result of getProperties')

  simple.restore()
  t.end()
})

test('profileGet when signed out', function (t) {
  simple.mock(internals, 'isSignedIn').returnWith(false)
  var result = get('internal state')

  t.deepEqual(internals.isSignedIn.lastCall.args, ['internal state'], 'calls utils.isSignedIn with internal state')
  t.same(result, undefined, 'returns undefined')

  t.end()
})
