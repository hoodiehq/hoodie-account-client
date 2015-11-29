var test = require('tape')
var nock = require('nock')

var findAll = require('../../admin/lib/accounts/find-all')

var baseURL = 'http://localhost:3000'
var accountsResponse = require('../fixtures/accounts.json')
var accountsReturn = require('../fixtures/accounts-return.json')
var accountsWithProfileResponse = require('../fixtures/accounts-with-profile.json')
var accountsWithProfileReturn = require('../fixtures/accounts-with-profile-return.json')

var state = {
  url: baseURL,
  session: {
    id: 'sessionId123'
  }
}

test('fetch all accounts', function (t) {
  t.plan(1)

  nock(baseURL)
    .get('/accounts')
    .reply(200, accountsResponse)

  findAll(state)

  .then(function (accounts) {
    t.deepEqual(accounts, accountsReturn, 'resolves with accounts')
  })

  .catch(t.fail)
})

test('fetch all accounts with {include: "profile"}', function (t) {
  t.plan(1)

  nock(baseURL)
    .get('/accounts?include=profile')
    .reply(200, accountsWithProfileResponse)

  findAll(state, {include: 'profile'})

  .then(function (accounts) {
    t.deepEqual(accounts, accountsWithProfileReturn, 'resolves with accounts')
  })

  .catch(t.fail)
})
