var simple = require('simple-mock')
var test = require('tape')

var update = require('../../admin/lib/accounts/update')

test('acconuntsUpdate', function (t) {
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

  simple.mock(update.internals, 'find').resolveWith({ existing: 'property' })
  simple.mock(update.internals, 'request').resolveWith()
  simple.mock(update.internals, 'deserialise').returnWith('deserialise accounts')

  update(state, 'abc1234', {
    password: 'newsecret',
    somenew: 'property'
  }, options)

  .then(function (account) {
    t.deepEqual(update.internals.find.lastCall.args, [
      state,
      'abc1234',
      options
    ])
    t.deepEqual(update.internals.request.lastCall.arg, {
      method: 'PATCH',
      url: 'http://localhost:3000/accounts/abc1234',
      headers: {
        authorization: 'Session sessionId123'
      },
      body: {
        data: {
          attributes: {
            somenew: 'property'
          },
          type: 'account'
        }
      }
    })

    t.deepEqual(account, {
      existing: 'property',
      somenew: 'property'
    }, 'resolves with new all account properties, without password')
  })

  .catch(t.error)
})

test('acconuntsUpdate', function (t) {
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
    'include': 'profile'
  }

  simple.mock(update.internals, 'find').resolveWith({ existing: 'property' })
  simple.mock(update.internals, 'request').resolveWith()
  simple.mock(update.internals, 'deserialise').returnWith('deserialise accounts')

  update(state, 'abc1234', {
    password: 'newsecret',
    somenew: 'property'
  }, options)

  .then(function (account) {
    t.deepEqual(update.internals.find.lastCall.args, [
      state,
      'abc1234',
      options
    ])
    t.deepEqual(update.internals.request.lastCall.arg, {
      method: 'PATCH',
      url: 'http://localhost:3000/accounts/abc1234?include=profile',
      headers: {
        authorization: 'Session sessionId123'
      },
      body: {
        data: {
          attributes: {
            somenew: 'property'
          },
          type: 'account'
        }
      }
    })

    t.deepEqual(account, {
      existing: 'property',
      somenew: 'property'
    }, 'resolves with new all account properties, without password')
  })

  .catch(t.error)
})
