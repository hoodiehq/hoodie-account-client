var simple = require('simple-mock')
var test = require('tape')

var findAll = require('../../admin/lib/accounts/find-all')

test('acconuntsFindAll', function (t) {
  t.plan(3)

  var state = {
    url: 'http://localhost:3000',
    account: {
      session: {
        id: 'sessionId123'
      }
    }
  }
  var options = {
    foo: 'bar'
  }

  simple.mock(findAll.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(findAll.internals, 'deserialise').returnWith('deserialise accounts')

  findAll(state, options)

  .then(function (accounts) {
    t.deepEqual(findAll.internals.request.lastCall.arg, {
      method: 'GET',
      url: 'http://localhost:3000/accounts',
      headers: {
        authorization: 'Session sessionId123'
      }
    })
    t.deepEqual(findAll.internals.deserialise.lastCall.args, [
      'response body',
      options
    ])

    t.is(accounts, 'deserialise accounts', 'resolves with accounts')
  })

  .catch(t.error)
})

test('acconuntsFindAll with {include: "profile"}', function (t) {
  t.plan(3)

  var state = {
    url: 'http://localhost:3000',
    account: {
      session: {
        id: 'sessionId123'
      }
    }
  }

  var options = {
    include: 'profile'
  }

  simple.mock(findAll.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(findAll.internals, 'deserialise').returnWith('deserialise accounts')

  findAll(state, options)

  .then(function (accounts) {
    t.deepEqual(findAll.internals.request.lastCall.arg, {
      method: 'GET',
      url: 'http://localhost:3000/accounts?include=profile',
      headers: {
        authorization: 'Session sessionId123'
      }
    })
    t.deepEqual(findAll.internals.deserialise.lastCall.args, [
      'response body',
      options
    ])

    t.is(accounts, 'deserialise accounts', 'resolves with accounts')
  })

  .catch(t.error)
})
