var test = require('tape')
var nock = require('nock')

var add = require('../../admin/lib/accounts/add')

var baseURL = 'http://localhost:3000'
var accountResponse = require('../fixtures/admin-account.json')
var accountReturn = require('../fixtures/admin-account-return.json')

var state = {
  url: baseURL,
  session: {
    id: 'sessionId123'
  }
}

test('fetch one account', function (t) {
  t.plan(1)

  nock(baseURL)
    .post('/accounts')
    .reply(200, accountResponse)

  add(state, {
    username: accountReturn.username,
    password: 'secret'
  })

  .then(function (account) {
    t.deepEqual(account, accountReturn, 'resolves with account')
  })

  .catch(t.fail)
})
