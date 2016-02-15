var nock = require('nock')
var simple = require('simple-mock')
var store = require('humble-localstorage')
var test = require('tape')

var Account = require('../../index')

var errorMessage = {
  errors: [{
    status: '401',
    title: 'Unauthorized',
    detail: 'Session invalid'
  }]
}

test('unauthenticate state within account.fetch()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    username: 'sam',
    session: {
      id: 'abc4567'
    }
  })

  nock('http://example.de')
    .get('/session/account')
    .reply(401, errorMessage)

  var account = new Account({url: 'http://example.de'})
  t.equal(account.hasInvalidSession(), undefined, '.hasInvalidSession() returns undefined')

  var unauthenticateHandler = simple.stub()
  account.on('unauthenticate', unauthenticateHandler)

  account.fetch()

  .then(function () {
    t.fail('account.fetch should fail')
  })

  .catch(function (error) {
    t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
    t.equal(account.hasInvalidSession(), true, 'account has invalid session')
    t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

    var localStorageAccount = store.getObject('account')
    t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')
  })
})

test('unauthenticate state within account.update()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    username: 'sam',
    session: {
      id: 'abc4567'
    }
  })

  nock('http://example.de')
    .patch('/session/account')
    .reply(401, errorMessage)

  var account = new Account({url: 'http://example.de'})
  t.equal(account.hasInvalidSession(), undefined, '.hasInvalidSession() returns undefined')

  var unauthenticateHandler = simple.stub()
  account.on('unauthenticate', unauthenticateHandler)

  account.update({username: 'newsam'})

  .then(function () {
    t.fail('account.update should fail')
  })

  .catch(function (error) {
    t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
    t.equal(account.hasInvalidSession(), true, 'account has invalid session')
    t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

    var localStorageAccount = store.getObject('account')
    t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')
  })
})

test('unauthenticate state within account.profile.update()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    username: 'sam',
    session: {
      id: 'abc4567'
    },
    profile: {
      id: 'abc4567'
    }
  })

  nock('http://example.de')
    .patch('/session/account/profile')
    .reply(401, errorMessage)

  var account = new Account({url: 'http://example.de'})
  t.equal(account.hasInvalidSession(), undefined, '.hasInvalidSession() returns undefined')

  var unauthenticateHandler = simple.stub()
  account.on('unauthenticate', unauthenticateHandler)

  account.profile.update({username: 'newsam'})

    .then(function () {
      t.fail('account.profile.fetch should fail')
    })

    .catch(function (error) {
      t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
      t.equal(account.hasInvalidSession(), true, 'account has invalid session')
      t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

      var localStorageAccount = store.getObject('account')
      t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')
    })
})

test('unauthenticate state within account.profile.fetch()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    session: {
      id: 'abc4567'
    }
  })

  nock('http://example.de')
    .get('/session/account/profile')
    .reply(401, errorMessage)

  var account = new Account({url: 'http://example.de'})
  t.equal(account.hasInvalidSession(), undefined, '.hasInvalidSession() returns undefined')

  var unauthenticateHandler = simple.stub()
  account.on('unauthenticate', unauthenticateHandler)

  account.profile.fetch()

  .then(function () {
    t.fail('account.profile.fetch should fail')
  })

  .catch(function (error) {
    t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
    t.equal(account.hasInvalidSession(), true, 'account has invalid session')
    t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

    var localStorageAccount = store.getObject('account')
    t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')
  })
})
