var test = require('tape')

var Account = require('../../index')
var get = require('../../lib/get')

var baseURL = 'http://localhost:3000'
var state = {
  session: {
    id: 'sessionId123',
    account: {
      username: 'docsChicken',
      plan: 'developer'
    }
  }
}

test('has "get" methods', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.get, 'function', 'has "get()"')
})

test('get account details', function (t) {
  t.plan(2)

  var accountInfo = get(state, 'account')

  t.is(typeof accountInfo, 'object', 'returns account object')
  t.equal(accountInfo, state.session.account, 'contains correct object')
})

test('get account returns undefined when user not logged in', function (t) {
  t.plan(1)

  var accountInfo = get({}, 'account')

  t.is(typeof accountInfo, 'undefined', 'returns undefined')
})

test('get account username from string', function (t) {
  t.plan(2)

  var username = get(state, 'account', 'username')

  t.is(typeof username, 'string', 'returns username string')
  t.equal(username, state.session.account.username, 'contains correct username')
})

test('get account username from array', function (t) {
  t.plan(2)

  var username = get(state, 'account', ['username'])

  t.is(typeof username, 'string', 'returns username string')
  t.equal(username, state.session.account.username, 'contains correct username')
})

test('get account details from array', function (t) {
  t.plan(2)

  var accountInfo = get(state, 'account', ['username', 'plan'])

  t.true(Array.isArray(accountInfo), 'returns array')
  t.deepEqual(accountInfo, [state.session.account.username, state.session.account.plan], 'contains correct account info')
})
