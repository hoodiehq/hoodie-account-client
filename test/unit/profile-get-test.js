var simple = require('simple-mock')
var test = require('tape')

var get = require('../../lib/profile-get')
var internals = get.internals

test('profileGet', function (t) {
  simple.mock(internals, 'getProperties').returnWith('foo')
  var result = get({
    account: {
      profile: 'profile'
    }
  }, 'path')

  t.deepEqual(internals.getProperties.lastCall.args, [
    'profile',
    'path'
  ], 'calls utils.getProperties with "profile" basepath')
  t.is(result, 'foo', 'returns result of fetchProperties')

  simple.restore()
  t.end()
})

test('profileGet with empty profile', function (t) {
  simple.mock(internals, 'getProperties').returnWith(undefined)
  var result = get({
    account: {}
  })

  t.deepEqual(internals.getProperties.lastCall.args, [
    undefined,
    undefined
  ], 'calls utils.getProperties with "profile" basepath')
  t.same(result, {}, 'returns result of fetchProperties')

  simple.restore()
  t.end()
})
