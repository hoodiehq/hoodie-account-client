var nock = require('nock')
var simple = require('simple-mock')
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

test('events', function (t) {
  t.plan(9)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(201, signUpResponse)
    .put('/session')
    .reply(201, signInResponse)
    .delete('/session')
    .reply(204)

  var signUpHandler = simple.stub()
  var signInHandler = simple.stub()
  var signOutHandler = simple.stub()
  account.on('signup', signUpHandler)
  account.on('signin', signInHandler)
  account.on('signout', signOutHandler)

  account.signUp(options)

  .then(function () {
    t.deepEqual(signUpHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'chicken@docs.com'
    }, '"signup" event emitted with account object')

    return account.signIn(options)
  })

  .then(function (accountProperties) {
    var sessionData = store.getObject('_session')
    t.is(accountProperties.username, options.username, 'returns correct username')
    t.is(sessionData.account.username, accountProperties.username, 'stored correct username in session')
    t.is(sessionData.id, signInResponse.data.id, 'stored correct session id')

    t.deepEqual(signInHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: { id: 'sessionid123' }
    }, '"signin" event emitted with account object')

    return account.signOut()
  })

  .then(function () {
    t.deepEqual(signOutHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: { id: 'sessionid123' }
    }, '"signout" event emitted with account object')

    t.is(signUpHandler.callCount, 1, '"signup" event emitted once')
    t.is(signInHandler.callCount, 1, '"signin" event emitted once')
    t.is(signOutHandler.callCount, 1, '"signout" event emitted once')
  })

  .catch(t.error)
})
