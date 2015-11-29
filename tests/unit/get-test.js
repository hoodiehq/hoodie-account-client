var simple = require('simple-mock')
var test = require('tape')

var get = require('../../lib/get')
var internals = get.internals

test('get', function (t) {
  simple.mock(internals, 'getProperties').returnWith('foo')
  var result = get({
    session: {
      account: 'account'
    }
  }, 'path')

  t.deepEqual(internals.getProperties.lastCall.args, [
    'account',
    'path'
  ], 'calls utils.getProperties with "account" basepath')
  t.is(result, 'foo', 'returns result of fetchProperties')

  simple.restore()
  t.end()
})
