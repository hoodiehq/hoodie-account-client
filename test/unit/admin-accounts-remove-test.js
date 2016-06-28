var simple = require('simple-mock')
var test = require('tape')

var remove = require('../../admin/lib/accounts/remove')

test('acconuntsRemove', function (t) {
  t.plan(3)

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
  var options = {
    foo: 'bar'
  }

  simple.mock(remove.internals, 'find').resolveWith('find account')
  simple.mock(remove.internals, 'request').resolveWith()
  simple.mock(remove.internals, 'serialise').returnWith('deserialise accounts')

  remove(state, 'abc1234', options)

  .then(function (account) {
    t.deepEqual(remove.internals.find.lastCall.args, [
      state,
      'abc1234',
      options
    ])
    t.deepEqual(remove.internals.request.lastCall.arg, {
      method: 'DELETE',
      url: 'http://localhost:3000/accounts/abc1234',
      headers: {
        authorization: 'Session sessionId123'
      }
    })

    t.deepEqual(account, 'find account', 'resolves with account')
  })

  .catch(t.error)
})
