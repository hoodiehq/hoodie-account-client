var simple = require('simple-mock')
var test = require('tape')

var fetch = require('../../lib/profile-fetch')
var internals = fetch.internals

test('profileFetch', function (t) {
  simple.mock(internals, 'fetchProperties').returnWith('foo')
  var result = fetch('state', 'path')

  t.deepEqual(internals.fetchProperties.lastCall.args, [
    'state',
    'account.profile',
    'path'
  ], 'calls utils.fetchProperties with "account.profile" basepath')
  t.is(result, 'foo', 'returns result of fetchProperties')

  simple.restore()
  t.end()
})
