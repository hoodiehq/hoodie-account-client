var simple = require('simple-mock')
var test = require('tape')

var fetch = require('../../lib/fetch')
var internals = fetch.internals

test('fetch', function (t) {
  simple.mock(internals, 'fetchProperties').returnWith('foo')
  var result = fetch('state', 'path')

  t.deepEqual(internals.fetchProperties.lastCall.args, [
    'state',
    'account',
    'path'
  ], 'calls fetchProperties with "account" basepath')
  t.is(result, 'foo', 'returns result of fetchProperties')

  simple.restore()
  t.end()
})
