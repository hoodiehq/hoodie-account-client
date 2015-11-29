var test = require('tape')
var nock = require('nock')

var find = require('../../admin/lib/accounts/find')

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
    .get('/accounts/abc1234')
    .reply(200, accountResponse)

  find(state, 'abc1234')

  .then(function (accounts) {
    t.deepEqual(accounts, accountReturn, 'resolves with account')
  })

  .catch(t.fail)
})
