var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signUpResponse = require('../fixtures/signup.json')
var signInResponse = require('../fixtures/signin.json')
var options = {
  username: signUpResponse.data.attributes.username,
  password: 'secret'
}

test('successful account.signIn(options)', function (t) {
  t.plan(3)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(200, signUpResponse)
    .put('/session')
    .reply(201, signInResponse)

  account.signUp(options)

  .then(function () {
    return account.signIn(options)
  })

  .then(function (returnedObject) {
    var sessionData = store.getObject('_session')
    t.is(returnedObject.username, options.username, 'returns correct username')
    t.is(sessionData.account.username, returnedObject.username, 'stored correct username in session')
    t.is(sessionData.id, signInResponse.data.id, 'stored correct session id')
  })

  .catch(t.error)
})
