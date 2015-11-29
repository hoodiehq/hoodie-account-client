var test = require('tape')
var nock = require('nock')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signUpResponse = require('../fixtures/signup.json')
var options = {
  username: signUpResponse.data.attributes.username,
  password: 'secret'
}
test('successful account.signUp(options)', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(201, signUpResponse)

  account.signUp(options)

  .then(function (returnedObject) {
    t.is(returnedObject.username, options.username, 'returns correct username')
    t.ok(returnedObject.id, 'returns account id')
  })
  .catch(function (error) {
    t.fail(error)
  })
})
