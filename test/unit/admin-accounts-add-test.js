var simple = require('simple-mock')
var test = require('tape')

var add = require('../../admin/lib/accounts/add')

test('acconuntsAdd', function (t) {
  t.plan(5)

  var state = {
    url: 'http://localhost:3000',
    account: {
      session: {
        id: 'sessionId123'
      }
    },
    accountsEmitter: {
      emit: simple.stub()
    }
  }

  simple.mock(add.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(add.internals, 'serialise').returnWith('serialise account')
  simple.mock(add.internals, 'deserialise').returnWith('deserialise account')

  var accountProperties = {
    username: 'pat',
    password: 'secret'
  }
  var options = {
    foo: 'bar'
  }
  add(state, accountProperties, options)

  .then(function (result) {
    t.deepEqual(add.internals.serialise.lastCall.args, [
      'account',
      accountProperties
    ])
    t.deepEqual(add.internals.deserialise.lastCall.args, [
      'response body',
      options
    ])
    t.deepEqual(result, 'deserialise account', 'resolves with account')
    t.is(state.accountsEmitter.emit.calls[0].arg, 'add', '"add event triggered"')
    t.is(state.accountsEmitter.emit.calls[1].arg, 'change', '"change event triggered"')

    simple.restore()
  })

  .catch(t.error)
})
