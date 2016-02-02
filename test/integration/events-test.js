var nock = require('nock')
var simple = require('simple-mock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signUpResponse = require('../fixtures/signup.json')
var signInResponse = require('../fixtures/signin.json')
var updateResponse = require('../fixtures/update.json')
var options = {
  username: signUpResponse.data.attributes.username,
  password: 'secret'
}

test('events', function (t) {
  t.plan(15)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(201, signUpResponse)
    .put('/session').thrice()
    .reply(201, signInResponse)
    .patch('/session/account')
    .reply(201, updateResponse)
    .delete('/session')
    .reply(204)

  var signUpHandler = simple.stub()
  var signInHandler = simple.stub()
  var signOutHandler = simple.stub()
  var reauthenticateHandler = simple.stub()
  var updateHandler = simple.stub()
  account.on('signup', signUpHandler)
  account.on('signin', signInHandler)
  account.on('signout', signOutHandler)
  account.on('reauthenticate', reauthenticateHandler)
  account.on('update', updateHandler)

  account.signUp(options)

  .then(function () {
    t.deepEqual(signUpHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      profile: {
        email: 'chicken@docs.com',
        fullName: 'Docs Chicken'
      }
    }, '"signup" event emitted with account object')

    return account.signIn(options)
  })

  // Check whether signing in again emits 'reauthenticate' instead of 'signin'
  .then(function (accountProperties) {
    return account.signIn(options)
  })

  .then(function (accountProperties) {
    var storeAccountData = store.getObject('account')
    t.is(accountProperties.username, options.username, 'returns correct username')
    t.is(storeAccountData.username, accountProperties.username, 'stored correct username in session')
    t.is(storeAccountData.session.id, signInResponse.data.id, 'stored correct session id')

    t.deepEqual(signInHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: { id: 'sessionid123' }
    }, '"signin" event emitted with account object')

    return account.update({username: updateResponse.data.attributes.username})
  })

  .then(function (accountProperties) {
    var storeAccountData = store.getObject('account')
    t.is(accountProperties.username, updateResponse.data.attributes.username, 'returns correct username')
    t.is(storeAccountData.username, accountProperties.username, 'stored correct username in session')
    t.is(storeAccountData.session.id, signInResponse.data.id, 'stored correct session id')

    t.deepEqual(updateHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'newchicken@docs.com',
      session: { id: 'sessionid123' }
    }, '"update" event emitted with account object')

    return account.signOut()
  })

  .then(function () {
    t.deepEqual(signOutHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'newchicken@docs.com',
      session: { id: 'sessionid123' }
    }, '"signout" event emitted with account object')

    t.is(signUpHandler.callCount, 1, '"signup" event emitted once')
    t.is(signInHandler.callCount, 1, '"signin" event emitted once')
    t.is(signOutHandler.callCount, 1, '"signout" event emitted once')
    t.is(reauthenticateHandler.callCount, 1, '"reauthenticate" event emitted once')
    t.is(updateHandler.callCount, 1, '"update" event emitted once')
  })

  .catch(t.error)
})
