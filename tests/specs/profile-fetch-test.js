var test = require('tape')
var nock = require('nock')

var fetch = require('../../lib/fetch')

var baseURL = 'http://localhost:3000'
var fetchResponse = require('../fixtures/fetch-profile.json')
var state = {
  url: baseURL,
  session: {
    id: 'sessionId123'
  }
}

test('fetch profile details', function (t) {
  t.plan(2)

  var expectedObject = fetchResponse.data.attributes
  expectedObject.id = fetchResponse.data.id

  nock(baseURL)
    .get('/session/account/profile')
    .reply(200, JSON.stringify(fetchResponse))

  fetch(state, 'account.profile')

  .then(function (accountInfo) {
    t.is(typeof accountInfo, 'object', 'returns account object')
    t.deepEqual(accountInfo, expectedObject, 'contains correct info')
  })

  .catch(t.fail)
})

test('fetch profile fullName', function (t) {
  t.plan(2)

  nock(baseURL)
    .get('/session/account/profile')
    .reply(200, JSON.stringify(fetchResponse))

  fetch(state, 'account.profile', 'fullName')

  .then(function (fullName) {
    t.is(typeof fullName, 'string', 'returns string')
    t.is(fullName, fetchResponse.data.attributes.fullName, 'contains correct fullName')
  })

  .catch(t.fail)
})
