var nock = require('nock')
var store = require('humble-localstorage')
var test = require('tape')

var AccountAdmin = require('../../admin/index')

var accountsResponse = require('../fixtures/accounts')
var accountsUnauthenticatedResponse = require('../fixtures/accounts-401')
// this fixture ought contain:
// 1. an id matching one of the user accounts in the accounts fixture
// 2. a session id distinct from the session ids in all other fixtures
var sessionsResponse = require('../fixtures/sessions')

var makeAddUnauthenticatedTest = function (admin) {
  return function (t) {
    nock('http://localhost:3000')
      .get('/accounts')
      .reply(401, accountsUnauthenticatedResponse)

    admin.sessions.add({
      username: 'pat'
    }).then(function (res) {
      t.notOk(res, 'expected error on unauthenticated admin')
    }, function (err) {
      t.ok(err, 'got error with unauthenticaed admin session')
      t.equal(err.name, 'UnauthorizedError',
              'correct error type')
    }).then(function () {
      t.end()
    }).catch(t.error)
  }
}

var makeAddNoUsernameTest = function (admin) {
  return function (t) {
    nock('http://localhost:3000')
      .get('/accounts')
      .reply(200, accountsResponse)

    admin.sessions.add().then(function (res) {
      t.notOk(res, 'expected error on missing username')
    }, function (err) {
      // this block isn't hit (?)
      t.ok(err, 'error on missing username')
      t.equal(err.name, 'Error', 'generic error')
      t.equal(err.message, 'options.username is required',
              'correct error message')
    }).then(function () {
      t.end()
    }).catch(function (err) {
      t.ok(err, 'error on missing username')
      t.equal(err.name, 'Error', 'generic error')
      t.equal(err.message, 'options.username is required',
              'correct error message')
      t.end()
    })
  }
}

// currently out of scope
var makeAddUnconfirmedTest = function (admin) {
  return function (t) {
    t.notOk(true, 'unimplemented')
    t.end()
  }
}

var makeAddNotFoundTest = function (admin) {
  return function (t) {
    nock('http://localhost:3000')
      .get('/accounts')
      .reply(200, accountsResponse)

    admin.sessions.add({
      username: 'quidjybo' // this username ought not exist in fixtures
    }).then(function (res) {
      t.notOk(res, 'expected error on non-existant username')
    }, function (err) {
      t.ok(err, 'error on non-existant username')
      t.equal(err.name, 'NotFoundError',
              'correct error type on non-existant username')
    }).then(function () {
      t.end()
    })
  }
}

var makeAddConnectionErrorTest = function (admin) {
  return function (t) {
    admin.sessions.add({
      username: 'pat'
    }).then(function (res) {
      t.notOk(res, 'expected error on no connection')
    }, function (err) {
      t.ok(err, 'error on no connection')
      // internals (?)
      t.equal(err.name, 'ConnectionError',
              'correct error type on no connection')
    }).then(function () {
      t.end()
    })
  }
}

var makeAddOkTest = function (admin) {
  return function (t) {
    var reUrl = /^\/accounts\/(.*)\/sessions$/
    nock('http://localhost:3000')
      .get('/accounts')
      .reply(200, accountsResponse)
      .post(reUrl)
      .reply(201, function (url, requestBody) {
        var accountId = url.match(reUrl)[1]
        t.equal(sessionsResponse.data.relationships.account.data.id,
                accountId,
                'got expected account id')
        return sessionsResponse
      })

    admin.sessions.add({
      username: 'pat'
    }).then(function (sessionProperties) {
      t.ok(sessionProperties, 'got sessionProperties response')
      t.ok(sessionProperties.account, 'SessionProperties has account')
      t.deepEqual({
        id: sessionProperties.id,
        account: {
          id: sessionProperties.account.id,
          username: sessionProperties.account.username
        }
      }, {
        id: 'sessionid456',
        account: {
          id: 'abc4567',
          username: 'pat'
        }
      }, 'got expected sessionProperties data')
    }).then(function () {
      t.end()
    }).catch(t.end)
  }
}

var makeAddTest = function (admin) {
  return function (t) {
    t.ok(admin.sessions.add, 'Sessions.add exists')
    t.is(typeof admin.sessions.add, 'function',
         'Sessions.add is a function')
    t.test('admin unauthenticated', makeAddUnauthenticatedTest(admin))
    t.test('no username', makeAddNoUsernameTest(admin))
    t.skip('unconfirmed', makeAddUnconfirmedTest(admin))
    t.test('account not found', makeAddNotFoundTest(admin))
    t.test('connection error', makeAddConnectionErrorTest(admin))
    t.test('add ok', makeAddOkTest(admin))
    t.end()
  }
}

test('admin sessions', function (t) {
  // AccountAdmin sets state.account according to localStorage
  // state updates on signin&out (?)
  store.setObject('account_admin', {
    username: 'patmin',
    session: {
      id: 'abc4567'
    }
  })

  var admin = new AccountAdmin({
    url: 'http://localhost:3000'
  })

  var sessions = admin.sessions

  store.setObject('account_admin', {
    username: 'patmin',
    session: {
      id: 'abc4567'
    }
  })

  t.ok(sessions, 'admin has sessions object')

  if (sessions) {
    t.test('add', makeAddTest(admin))
  }
  t.end()
})
