var store = require('humble-localstorage')

var test = require('tape')
var nock = require('nock')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'

var signInResponse = require('../fixtures/signin.json')
var updateResponse = require('../fixtures/update-profile.json')

var options = {
  username: 'chicken@docs.com',
  password: 'secret'
}

test('sign in and change username', function (t) {
  store.clear()

  t.plan(5)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  nock(baseURL)
    .put('/session', function (body) {
      return body.data.attributes.password === 'secret'
    })
    .reply(201, signInResponse)
    .patch('/session/account/profile', function (body) {
      t.is(body.data.attributes.fullName, 'Docs Chicken', 'request sends profile properties')
      return true
    })
    .reply(200, updateResponse)

  account.signIn(options)

  .then(function (signInResult) {
    t.pass('signs in')
    t.is(signInResult.username, 'chicken@docs.com')

    return account.profile.update({
      fullName: 'Docs Chicken',
      favoriteClothing: 'Clothing'
    })
  })

  .then(function (profileProperties) {
    t.is(profileProperties.fullName, 'Docs Chicken', 'profile.update() resolves with profile properties')
  })

  .then(function () {
    var profileProperties = account.profile.get()
    t.is(profileProperties.fullName, 'Docs Chicken', 'profile.get() returns profile properties')
  })

  .catch(t.error)
})
