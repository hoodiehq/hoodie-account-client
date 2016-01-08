var simple = require('simple-mock')
var test = require('tape')

var request = require('../../lib/request')

test('request without options', function (t) {
  t.plan(1)

  request()
    .then(t.fail.bind(t, 'must reject'))
    .catch(t.pass.bind(t, 'rejects with error'))
})

test('request without options.type', function (t) {
  t.plan(1)

  request({})
    .then(t.fail.bind(t, 'must reject'))
    .catch(t.pass.bind(t, 'rejects with error'))
})

test('successful account.request(options)', function (t) {
  t.plan(8)

  var state = {
    url: 'http://example.com',
    cacheKey: 'cacheKey123',
    emitter: {
      emit: simple.stub()
    }
  }

  simple.mock(request.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(request.internals, 'serialise').returnWith('serialised')
  simple.mock(request.internals, 'deserialise').returnWith('deserialised')

  request(state, {
    type: 'passwordreset',
    email: 'pat@example.com'
  })

  .then(function (accountProperties) {
    t.deepEqual(request.internals.request.lastCall.arg, {
      method: 'POST',
      url: 'http://example.com/requests',
      body: 'serialised'
    })
    t.deepEqual(request.internals.deserialise.lastCall.arg, 'response body')
    t.deepEqual(request.internals.serialise.lastCall.args[0], 'request')
    t.deepEqual(request.internals.serialise.lastCall.args[1], {
      type: 'passwordreset',
      email: 'pat@example.com'
    })

    t.equal(accountProperties, 'deserialised', 'resolves deserialised request')
    t.equal(state.emitter.emit.callCount, 1, '1 event emitted')
    t.equal(state.emitter.emit.lastCall.args[0], 'passwordreset', 'passwordreset event emitted')
    t.equal(state.emitter.emit.lastCall.args[1], 'deserialised', 'deserialised request passed')

    simple.restore()
  })

  .catch(t.error)
})

test('request with request error', function (t) {
  t.plan(1)

  simple.mock(request.internals, 'request').rejectWith(new Error('Ooops'))

  request({})

  .then(t.fail.bind(t, 'must reject'))

  .catch(function (error) {
    t.is(typeof error, 'object', 'returns error object')
    simple.restore()
  })
})
