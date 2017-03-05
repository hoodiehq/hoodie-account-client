var simple = require('simple-mock')
var test = require('tape')

var get = require('../../lib/profile-get')
var internals = get.internals

test('profileGet', function (t) {
  simple.mock(internals, 'getProperties').returnWith('foo')
  var result = get({
    account: {
      profile: 'profile',
      session: {}
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
  var result = get({
    account: {
      session: {}
    }
  })

  t.same(result, {}, 'returns result of getProperties')

  simple.restore()
  t.end()
})

test('profileGet with empty profile and path argument', function (t) {
  simple.mock(internals, 'getProperties').returnWith(undefined)
  var result = get({
    account: {
      session: {}
    }
  }, 'foo')

  t.deepEqual(internals.getProperties.lastCall.args, [
    undefined,
    'foo'
  ], 'calls utils.getProperties with "profile" basepath')
  t.same(result, undefined, 'returns result of getProperties')

  simple.restore()
  t.end()
})

test('profileGet when signed out', function (t) {
  var state = {
    account: {}
  }
  var result = get(state)

  t.same(result, undefined, 'returns undefined')

  t.end()
})
