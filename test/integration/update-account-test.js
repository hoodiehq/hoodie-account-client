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

test('sign in and change username', function (t) {
  store.clear()

  t.plan(10)

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
    .reply(201, signInResponseAfterUpdate)

  account.signIn(options)

  .then(function (signInResult) {
    t.pass('signes in')
    t.is(signInResult.username, 'chicken@docs.com')

    return account.update({ username: 'newchicken@docs.com', password: 'newsecret' })
  })

  .then(function (updateResult) {
    t.pass('update resultResult received')
    t.is(updateResult.username, 'newchicken@docs.com', 'new account name in result')
    t.is(account.username, 'newchicken@docs.com', 'account username set to new one')

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
