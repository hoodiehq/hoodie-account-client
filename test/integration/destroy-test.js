var test = require('tape')
var store = require('humble-localstorage')
var Account = require('../../index')
var nock = require('nock')
var clone = require('lodash/clone')
var signInResponse = clone(require('../fixtures/signin.json'))
var simple = require('simple-mock')
var lolex = require('lolex')

var baseURL = 'http://localhost:3000'
var options = {
  username: 'chicken@docs.com',
  password: 'secret'
}

test('destroy account', function (t) {
  store.clear()
  t.plan(6)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  nock(baseURL)
  .put('/session')
  .reply(201, signInResponse)
  .delete('/session/account')
  .reply(204)

  var signOutHandler = simple.stub()
  var destroyHandler = simple.stub()
  account.on('signout', signOutHandler)
  account.on('destroy', destroyHandler)

  account.signIn(options)

  .then(function () {
    t.pass('signes in')
    return account.destroy()
  })

  .then(function () {
    t.pass('destroys account')

    t.deepEqual(signOutHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: { id: 'sessionid123' }
    }, '"signout" event emitted with account object')

    t.deepEqual(destroyHandler.lastCall.arg, {
      id: 'abc4567',
      username: 'chicken@docs.com',
      session: { id: 'sessionid123' }
    }, '"destroy" event emitted with account object')

    t.is(signOutHandler.callCount, 1, '"signout" event emitted once')
    t.is(destroyHandler.callCount, 1, '"destroy" event emitted once')
  })

  .catch(t.error)
})

test('destroy account even when session is invalid', function (t) {
  store.clear()
  t.plan(5)

  // mock the Date object to always return 1970-01-01T00:00:00.000Z
  var clock = lolex.install(0)
  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  var signOutHandler = simple.stub()
  var destroyHandler = simple.stub()
  account.on('signout', signOutHandler)
  account.on('destroy', destroyHandler)

  account.destroy(options)

  .then(function () {
    clock.uninstall()
    t.pass('destroys account')

    t.deepEqual(signOutHandler.lastCall.arg, {
      createdAt: '1970-01-01T00:00:00.000Z',
      id: 'abc4567'
    }, '"signout" event emitted with account object')

    t.deepEqual(destroyHandler.lastCall.arg, {
      createdAt: '1970-01-01T00:00:00.000Z',
      id: 'abc4567'
    }, '"destroy" event emitted with account object')

    t.is(signOutHandler.callCount, 1, '"signout" event emitted once')
    t.is(destroyHandler.callCount, 1, '"destroy" event emitted once')
  })

  .catch(t.error)
})
