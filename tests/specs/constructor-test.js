var test = require('tape')

var Account = require('../../index')

test('new Account(options)', function (t) {
  var account = new Account({
    url: 'http://localhost:3000/session/account'
  })

  t.is(typeof account, 'object', 'Account is a constructor')
  t.ok(account.hasOwnProperty('id'), 'account.id exists')
  t.is(account.id, 'undefined', 'account.id is undefined')

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
