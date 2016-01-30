var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

test('account.fetch() and account.profil.fetch()', function (t) {
  t.plan(1)

  // simulate signed in state
  store.setObject('account', {
    username: 'john-doe',
    id: 'abc4567',
    session: {
      id: 'sessionid123'
    }
  })

  var account = new Account({
    url: 'http://localhost:3000',
    id: 'abc4567'
  })

  var apiMock = nock('http://localhost:3000')
    .get('/session/account')
    .reply(200, require('../fixtures/fetch.json'))
    .get('/session/account/profile')
    .reply(200, require('../fixtures/fetch-profile.json'))

  account.fetch()

  .then(function () {
    return account.profile.fetch()
  })

  .then(function () {
    t.is(apiMock.pendingMocks()[0], undefined, 'all mocks satisfied')
  })

  .catch(t.fail)
})
