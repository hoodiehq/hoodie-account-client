var test = require('tape')
var nock = require('nock')

var update = require('../../admin/lib/accounts/update')

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
    .patch('/accounts/abc1234')
    .reply(200, accountResponse)

  update(state, 'abc1234', {
    password: 'newsecret'
  })

  .then(function (account) {
    t.deepEqual(account, accountReturn, 'resolves with account')
  })

  .catch(t.error)
})
