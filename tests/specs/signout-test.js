var test = require('tape')
var nock = require('nock')

var Account = require('../../index')
var localStorageWrapper = require('humble-localstorage')

var baseURL = 'http://localhost:3000'
var options = {
  username: 'jane@example.com',
  password: 'secret'
}

test('has "signOut" method', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.signOut, 'function', 'has "signOut()"')
})

test('successful signOut()', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL
  })

  var returnedAccount = {
    username: options.username,
    session: {
      id: 'sessionid123'
    }
  }

  nock(baseURL)
    .put('/session/account')
    .reply(200, JSON.stringify(returnedAccount))
    .put('/session')
    .reply(201, JSON.stringify(returnedAccount.session))
    .delete('/session')
    .reply(204)

  account.signUp(options)

  .then(function () {
    return account.signIn(options)
  })

  .then(function () {
    return account.signOut()
  })

  .then(function (returnedUsername) {
    var sessionData = localStorageWrapper.getObject('_session')

    t.is(returnedUsername, options.username, 'returns correct username')
    t.is(sessionData, null, 'nulls stored session object')
  })
})

test('catch errors from signOut()', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .delete('/session')
    .replyWithError({ 'message': 'no server connection' })

  account.signOut()

  .then(function () {
    t.fail('error was not caught')
  })

  .catch(function () {
    t.pass('error has been caught')
  })
})
