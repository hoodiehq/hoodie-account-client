var store = require('humble-localstorage')

var test = require('tape')
var nock = require('nock')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'

var signInResponse = require('../fixtures/signin.json')
var signInResponseAfterUpdate = require('../fixtures/signin-after-update.json')
var updateResponse = require('../fixtures/update.json')

var options = {
  username: 'chicken@docs.com',
  password: 'secret'
}

var uniqueId = 1

test('sign in and change username', function (t) {
  store.clear()

  t.plan(11)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  nock(baseURL)
    .put('/session', function (body) {
      return body.data.attributes.password === 'secret'
    })
    .reply(201, signInResponse)
    .delete('/session')
    .reply(204)
    .patch('/session/account', function (body) {
      t.is(body.data.attributes.password, 'newsecret', 'request uses new password')
      return true
    })
    .reply(200, updateResponse)
    .put('/session', function (body) {
      return body.data.attributes.password === 'newsecret'
    })
    .thrice()
    .reply(201, function () {
      // Session is updated everytime a user puts
      signInResponseAfterUpdate.data.id = 'Session' + (uniqueId++)
      return signInResponseAfterUpdate
    })

  account.signIn(options)

  .then(function (signInResult) {
    t.pass('signs in')
    t.is(signInResult.username, 'chicken@docs.com')

    return account.update({ username: 'newchicken@docs.com', password: 'newsecret' })
  })

  .then(function (updateResult) {
    t.pass('update resultResult received')
    t.is(updateResult.username, 'newchicken@docs.com', 'new account name in result')
    t.is(account.username, 'newchicken@docs.com', 'account username set to new one')
    t.is(updateResult.session.id, account.get('session.id'), 'account session should be the same as the result')

    return account.signOut()
  })

  .then(function () {
    t.pass('signed out')

    return account.signIn({ username: 'newchicken@docs.com', password: 'newsecret' })
  })

  .then(function (signInResult) {
    t.pass('signed in again')

    t.is(signInResult.username, 'newchicken@docs.com', 'results with new username')
    t.is(account.username, 'newchicken@docs.com', 'account.username is set to new one')
  })

  .catch(t.error)
})
