var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

test('new Account(options)', function (t) {
  store.clear()
  var account = new Account({
    url: 'http://localhost:3000'
  })

  t.is(typeof account, 'object', 'Account is a constructor')
  t.is(typeof account.validate, 'function', 'has "validate()"')
  t.is(typeof account.get, 'function', 'has "get()"')
  t.is(typeof account.profile.get, 'function', 'has "profile.get()"')
  t.is(typeof account.profile.update, 'function', 'has "profile.update()"')
  t.is(typeof account.signIn, 'function', 'has "signIn()"')
  t.is(typeof account.signOut, 'function', 'has "signOut()"')
  t.is(typeof account.signUp, 'function', 'has "signUp()"')
  t.is(typeof account.request, 'function', 'has "request()"')
  t.is(typeof account.on, 'function', 'has "on()"')
  t.is(typeof account.one, 'function', 'has "one()"')
  t.is(typeof account.off, 'function', 'has "off()"')

  account.get('id')

  .then(function (id) {
    t.ok(id)
    t.end()
  })
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

test('new Account() w/o url object', function (t) {
  t.plan(2)

  store.setObject('account', {
    username: 'john-doe',
    id: 'abc4567',
    session: {
      id: 'sessionid123'
    }
  })

  var account = new Account('http://localhost:3000')

  var apiMock = nock('http://localhost:3000')
    .get('/session/account')
    .reply(200, require('../fixtures/fetch.json'))

  account.get()

  .then(function (accountProperties) {
    t.same(accountProperties, {id: 'abc4567', username: 'john-doe', session: { id: 'sessionid123' }})

    t.is(apiMock.pendingMocks()[0], undefined, 'all mocks satisfied')
  })

  .catch(t.error)
})
