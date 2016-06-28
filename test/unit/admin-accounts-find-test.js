var simple = require('simple-mock')
var test = require('tape')

var find = require('../../admin/lib/accounts/find')

test('accountsFind', function (t) {
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

  simple.mock(find.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(find.internals, 'deserialise').returnWith('deserialise accounts')

  find(state, 'abc1234', options)

  .then(function (accounts) {
    t.deepEqual(find.internals.request.lastCall.arg, {
      method: 'GET',
      url: 'http://localhost:3000/accounts/abc1234',
      headers: {
        authorization: 'Session sessionId123'
      }
    })
    t.deepEqual(find.internals.deserialise.lastCall.args, [
      'response body',
      options
    ])

    t.is(accounts, 'deserialise accounts', 'resolves with accounts')
  })

  .catch(t.error)
})

test('accountsFind with profile option included', function (t) {
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
    'include': 'profile'
  }

  simple.mock(find.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(find.internals, 'deserialise').returnWith('deserialise accounts')

  find(state, 'abc1234', options)

  .then(function (accounts) {
    t.deepEqual(find.internals.request.lastCall.arg, {
      method: 'GET',
      url: 'http://localhost:3000/accounts/abc1234?include=profile',
      headers: {
        authorization: 'Session sessionId123'
      }
    })
    t.deepEqual(find.internals.deserialise.lastCall.args, [
      'response body',
      options
    ])

    t.is(accounts, 'deserialise accounts', 'resolves with accounts')
  })

  .catch(t.error)
})
