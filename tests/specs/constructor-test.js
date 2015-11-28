var test = require('tape')

var Account = require('../../index')

var store = require('humble-localstorage')

test('new Account(options)', function (t) {
  store.clear()
  var account = new Account({
    url: 'http://localhost:3000/session/account'
  })

  t.is(typeof account, 'object', 'Account is a constructor')
  t.ok(account.hasOwnProperty('username'), 'account.username exists')
  t.is(account.username, undefined, 'account.username is undefined')

  t.end()
})

test('Account(options) w/o new', function (t) {
  var account = Account({
    url: 'http://localhost:3000/session/account'
  })

  t.is(typeof account, 'object', 'Account is a constructor')

  t.end()
})

test('new Account() w/o options', function (t) {
  t.throws(Account, 'throws error')

  t.end()
})

test('new Account() w/o options.url', function (t) {
  t.throws(Account.bind(null, { validate: function () {} }), 'throws error')

  t.end()
})
