var clone = require('lodash.clone')
var nock = require('nock')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signUpResponse = require('../fixtures/signup.json')
var signInResponse = clone(require('../fixtures/signin.json'))
signInResponse.data.relationships.account.data.id = 'newid123'
signInResponse.included.id = 'newid123'

var options = {
  username: signUpResponse.data.attributes.username,
  password: 'secret'
}

test('sign up with id', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  nock(baseURL)
    .put('/session/account', function (body) {
      t.is(body.data.id, 'abc4567', 'sends correct account id')
      return true
    })
    .reply(201, signUpResponse)
    .delete('/session')
    .reply(204)
    .put('/session/account', function (body) {
      t.isNot(body.data.id, 'abc4567', 'sends new account id')
      return true
    })
    .reply(201, signUpResponse)

  account.signUp(options)

  .then(function () {
    return account.signOut()
  })

  .then(function () {
    return account.signUp(options)
  })

  .catch(t.error)
})
