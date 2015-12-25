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
