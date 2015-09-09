var test = require('tape')
var nock = require('nock')

var Account = require('../../index')
var localStorageWrapper = require('humble-localstorage')

var baseURL = 'http://localhost:3000'
var options = {
  username: 'jane@example.com',
  password: 'secret'
}

test('has signIn method', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.signIn, 'function', 'has "signIn()')
})

test('signIn w/o required options', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  account.signIn()

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('signIn w/o required username', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  account.signIn({
    username: options.username
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('signIn w/o required password', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  account.signIn({
    password: options.password
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('successful account.signIn(options)', function (t) {
  t.plan(3)

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

  account.signUp(options)

  .then(function () {
    return account.signIn(options)
  })

  .then(function (returnedUsername) {
    var sessionData = localStorageWrapper.getObject('_session')
    t.is(returnedUsername, options.username, 'returns correct username')
    t.is(sessionData.account.username, returnedUsername, 'stored correct username in session')
    t.is(sessionData.id, returnedAccount.session.id, 'stored correct session id')
  })
})

test('catch error from account.signIn', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session')
    .replyWithError({ 'message': 'username not found' })

  account.signIn(options)

  .catch(function (error) {
    t.is(typeof error, 'object', 'returns error object')
  })
})
