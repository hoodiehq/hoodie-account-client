var test = require('tape')

var AccountAdmin = require('../../admin/index')

test('new AccountAdmin(options)', function (t) {
  var accountAdmin = new AccountAdmin({
    url: 'http://localhost:3000'
  })

  t.is(typeof accountAdmin, 'object', 'AccountAdmin is a constructor')

  t.ok(accountAdmin.hasOwnProperty('username'), 'accountAdmin.username exists')
  t.is(accountAdmin.username, undefined, 'accountAdmin.username is undefined')

  t.is(typeof accountAdmin.signUp, 'undefined', 'accountAdmin.signIn is undefined')
  t.is(typeof accountAdmin.signIn, 'function', 'accountAdmin.signIn is a function')
  t.is(typeof accountAdmin.signOut, 'function', 'accountAdmin.signOut is a function')

  t.is(typeof accountAdmin.accounts.add, 'function', 'accountAdmin.accounts.add is a function')
  t.is(typeof accountAdmin.accounts.find, 'function', 'accountAdmin.accounts.find is a function')
  t.is(typeof accountAdmin.accounts.findAll, 'function', 'accountAdmin.accounts.findAll is a function')
  t.is(typeof accountAdmin.accounts.update, 'function', 'accountAdmin.accounts.update is a function')
  t.is(typeof accountAdmin.accounts.remove, 'function', 'accountAdmin.accounts.remove is a function')
  t.is(typeof accountAdmin.accounts.on, 'function', 'accountAdmin.accounts.on is a function')
  t.is(typeof accountAdmin.accounts.one, 'function', 'accountAdmin.accounts.one is a function')
  t.is(typeof accountAdmin.accounts.off, 'function', 'accountAdmin.accounts.off is a function')

  t.is(typeof accountAdmin.on, 'function', 'has "on()"')
  t.is(typeof accountAdmin.one, 'function', 'has "one()"')
  t.is(typeof accountAdmin.off, 'function', 'has "off()"')

  t.end()
})

test('AccountAdmin(options) w/o new', function (t) {
  var accountAdmin = AccountAdmin({
    url: 'http://localhost:3000/session/account'
  })

  t.is(typeof accountAdmin, 'object', 'AccountAdmin is a constructor')

  t.end()
})

test('new AccountAdmin() w/o options', function (t) {
  t.throws(AccountAdmin, 'throws error')

  t.end()
})

test('new AccountAdmin() w/o options.url', function (t) {
  t.throws(AccountAdmin.bind(null, { validate: function () {} }), 'throws error')

  t.end()
})
