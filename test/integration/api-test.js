var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var sessionUnauthorizedResponse = require('../fixtures/put-session-401.json')

test('account.signIn() with invalid credentials', function (t) {
  t.plan(2)

  store.clear()
  var account = new Account({
    url: 'http://localhost:3000'
  })

  nock('http://localhost:3000')
    .put('/session')
    .reply(401, sessionUnauthorizedResponse)

  account.signIn({
    username: 'pat',
    password: 'wrong'
  })

  .then(t.fail.bind(t, 'must reject'))

  .catch(function (error) {
    t.is(error.name, 'UnauthorizedError', 'rejects with "UnauthorizedError" error')
    t.is(error.message, 'Invalid Credentials', 'rejects with correct message')
  })
})
