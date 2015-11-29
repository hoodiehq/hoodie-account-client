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
  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.get, 'function', 'has "get()"')

  t.end()
})

test('get account details', function (t) {
  var accountInfo = get(state, 'account')

  t.is(typeof accountInfo, 'object', 'returns account object')
  t.equal(accountInfo, state.session.account, 'contains correct object')

  t.end()
})

test('get account returns undefined when user not logged in', function (t) {
  var accountInfo = get({}, 'account')

  t.is(typeof accountInfo, 'undefined', 'returns undefined')

  t.end()
})

test('get account username from string', function (t) {
  var username = get(state, 'account', 'username')

  t.is(typeof username, 'string', 'returns username string')
  t.equal(username, state.session.account.username, 'contains correct username')

  t.end()
})

test('get account username from array', function (t) {
  var result = get(state, 'account', ['id', 'username'])

  t.is(typeof result, 'object', 'returns username string')
  t.equal(result.username, state.session.account.username, 'contains correct username')

  t.end()
})

test('get account details from array', function (t) {
  var accountInfo = get(state, 'account', ['username', 'plan'])

  t.is(typeof accountInfo, 'object', 'returns object')
  t.deepEqual(accountInfo, {
    username: 'docsChicken',
    plan: 'developer'
  }, 'contains correct account info')

  t.end()
})
