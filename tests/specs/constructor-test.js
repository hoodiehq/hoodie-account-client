var test = require('tape')

var Account = require('../../index')

test('new Account(options)', function (t) {
  t.plan(1)

  var account = new Account({
    url: 'http://localhost:3000/session/account'
  })

  t.is(typeof account, 'object', 'Account is a constructor')
})

test('Account(options) w/o new', function (t) {
  t.plan(1)

  var account = Account({
    url: 'http://localhost:3000/session/account'
  })

  t.is(typeof account, 'object', 'Account is a constructor')
})

test('new Account() w/o options', function (t) {
  t.plan(1)

  t.throws(Account, 'throws error')
})

test('new Account() w/o options.url', function (t) {
  t.plan(1)

  t.throws(Account.bind(null, { validate: function () {} }), 'throws error')
})
