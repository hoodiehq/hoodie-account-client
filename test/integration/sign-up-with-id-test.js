var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signInResponse = require('../fixtures/signin.json')
var signUpResponse = require('../fixtures/signup.json')

var options = {
  username: signUpResponse.data.attributes.username,
  password: 'secret'
}

test('sign up with id', function (t) {
  store.clear()
  t.plan(5)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  var mock = nock(baseURL)
    .put('/session/account', function (body) {
      t.is(body.data.id, 'abc4567', 'sends correct account id')
      return true
    })
    .reply(201, signUpResponse)

  account.signUp(options)

  .then(function () {
    t.pass('signs up')

    mock.put('/session').reply(201, signInResponse)

    return account.signIn(options)
  })
  .then(function () {
    t.pass('signs in')

    mock.delete('/session').reply(204)

    return account.signOut()
  })

  .then(function () {
    t.pass('signs out')

    mock
      .put('/session/account', function (body) {
        t.isNot(body.data.id, 'abc4567', 'sends new account id')
        return true
      })
      .reply(201, signUpResponse)
    return account.signUp(options)
  })

  .catch(t.error)
})
