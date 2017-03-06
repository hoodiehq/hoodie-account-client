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

test('unauthenticate state within account.get()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    username: 'sam',
    id: 'user1234',
    session: {
      id: 'abc4567'
    }
  })

  nock('http://example.de')
    .get('/session/account')
    .reply(401, errorMessage)

  var account = new Account({url: 'http://example.de'})
  var unauthenticateHandler = simple.stub()

  return account.get('session.invalid')

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, undefined, '.get("session.invalid") returns undefined')

    account.on('unauthenticate', unauthenticateHandler)

    return account.get()
  })

  .then(function () {
    t.fail('account.get should fail')
  })

  .catch(function (error) {
    t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
    t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

    var localStorageAccount = store.getObject('account')
    t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')

    return account.get('session.invalid')
  })

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, true, 'account has invalid session')
  })
})

test('unauthenticate state within account.update()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    username: 'sam',
    id: 'user1234',
    session: {
      id: 'abc4567'
    }
  })

  nock('http://example.de')
    .patch('/session/account')
    .reply(401, errorMessage)

  var account = new Account({url: 'http://example.de'})
  var unauthenticateHandler = simple.stub()

  return account.get('session.invalid')

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, undefined, '.get("session.invalid") returns undefined')

    account.on('unauthenticate', unauthenticateHandler)

    return account.update({username: 'newsam'})
  })

  .then(function () {
    t.fail('account.update should fail')
  })

  .catch(function (error) {
    t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
    t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

    var localStorageAccount = store.getObject('account')
    t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')

    return account.get('session.invalid')
  })

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, true, 'account has invalid session')
  })
})

test('unauthenticate state within account.profile.update()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    username: 'sam',
    id: 'user1234',
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
  var unauthenticateHandler = simple.stub()

  return account.get('session.invalid')

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, undefined, '.get("session.invalid") returns undefined')

    account.on('unauthenticate', unauthenticateHandler)

    return account.profile.update({username: 'newsam'})
  })

  .then(function () {
    t.fail('account.profile.update should fail')
  })

  .catch(function (error) {
    t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
    t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

    var localStorageAccount = store.getObject('account')
    t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')

    return account.get('session.invalid')
  })

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, true, 'account has invalid session')
  })
})

test('unauthenticate state within account.profile.get()', function (t) {
  t.plan(5)

  store.clear()
  store.setObject('account', {
    id: 'user1234',
    session: {
      id: 'abc4567'
    }
  })

  nock('http://example.de')
    .get('/session/account/profile')
    .reply(401, errorMessage)

  var account = new Account({url: 'http://example.de'})
  var unauthenticateHandler = simple.stub()

  return account.get('session.invalid')

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, undefined, '.get("session.invalid") returns undefined')

    account.on('unauthenticate', unauthenticateHandler)

    return account.profile.get()
  })

  .then(function () {
    t.fail('account.profile.get should fail')
  })

  .catch(function (error) {
    t.equal(error.name, 'UnauthorizedError', 'rejects with "UnauthenticatedError" error')
    t.is(unauthenticateHandler.callCount, 1, '"unauthenticate" event triggered once')

    var localStorageAccount = store.getObject('account')
    t.equal(localStorageAccount.session.invalid, true, 'account.session.invalid true in local storage')

    return account.get('session.invalid')
  })

  .then(function (hasInvalidSession) {
    t.equal(hasInvalidSession, true, 'account has invalid session')
  })
})
