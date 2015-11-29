var test = require('tape')
var nock = require('nock')

var Account = require('../../index')
var fetch = require('../../lib/fetch')

var baseURL = 'http://localhost:3000'
var fetchResponse = require('../fixtures/fetch.json')
var state = {
  url: baseURL,
  session: {
    id: 'sessionId123'
  }
}

test('has "fetch" methods', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.fetch, 'function', 'has "fetch()"')
})

test('fetch account details', function (t) {
  t.plan(2)

  nock(baseURL)
    .get('/session/account')
    .reply(200, JSON.stringify(fetchResponse))

  fetch(state, 'account')

  .then(function (accountInfo) {
    t.is(typeof accountInfo, 'object', 'returns account object')
    t.is(accountInfo.username, fetchResponse.data.attributes.username, 'contains correct username')
  })

  .catch(t.fail)
})

test('fetch account username', function (t) {
  t.plan(2)

  nock(baseURL)
    .get('/session/account')
    .reply(200, JSON.stringify(fetchResponse))

  fetch(state, 'account', 'username')

  .then(function (username) {
    t.is(typeof username, 'string', 'returns string')
    t.is(username, fetchResponse.data.attributes.username, 'contains correct username')
  })

  .catch(t.fail)
})
