var test = require('tape')
var nock = require('nock')

var Account = require('../../index')
var localStorageWrapper = require('humble-localstorage')

var baseURL = 'http://localhost:3000'
var signUpResponse = require('../fixtures/signup.json')
var signInResponse = require('../fixtures/signin.json')
var options = {
  username: signUpResponse.data.attributes.username,
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

  t.throws(account.signIn.bind(null), 'throws error')
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

  nock(baseURL)
    .put('/session/account')
    .reply(200, JSON.stringify(signUpResponse))
    .put('/session')
    .reply(201, JSON.stringify(signInResponse))

  account.signUp(options)

  .then(function () {
    return account.signIn(options)
  })

  .then(function (returnedObject) {
    var sessionData = localStorageWrapper.getObject('_session')
    t.is(returnedObject.username, options.username, 'returns correct username')
    t.is(sessionData.account.username, returnedObject.username, 'stored correct username in session')
    t.is(sessionData.id, signInResponse.data.id, 'stored correct session id')
  })

  .catch(t.fail)
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
