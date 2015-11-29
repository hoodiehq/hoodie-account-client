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

test('successful signOut()', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(200, JSON.stringify(signUpResponse))
    .put('/session')
    .reply(201, JSON.stringify(signInResponse))
    .delete('/session')
    .reply(204)

  account.signUp(options)

  .then(function () {
    return account.signIn(options)
  })

  .then(function () {
    return account.signOut()
  })

  .then(function (returnedObject) {
    var sessionData = localStorageWrapper.getObject('_session')

    t.is(returnedObject.username, options.username, 'returns correct username')
    t.is(sessionData, null, 'nulls stored session object')
  })

  .catch(t.fail)
})

test('catch errors from signOut()', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(200, JSON.stringify(signUpResponse))
    .put('/session')
    .reply(201, JSON.stringify(signInResponse))
    .delete('/session')
    .replyWithError({ 'message': 'no server connection' })

  account.signUp(options)

  .then(function () {
    return account.signIn(options)
  })

  .then(function () {
    return account.signOut()
  })

  .then(function () {
    t.fail('error was not caught')
  })

  .catch(function () {
    t.pass('error has been caught')
  })
})
