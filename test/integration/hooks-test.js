var store = require('humble-localstorage')

var clone = require('lodash/clone')
var nock = require('nock')
var test = require('tape')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signInResponse = clone(require('../fixtures/signin.json'))

var options = {
  username: 'chicken@docs.com',
  password: 'secret'
}

test('sign in with pre & post hooks', function (t) {
  store.clear()
  t.plan(2)

  nock(baseURL)
    .put('/session')
    .reply(201, signInResponse)

  var callOrder = []
  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  account.on('pre:signin', function (options) {
    options.hooks.push(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          callOrder.push(1)
          resolve()
        }, 100)
      })
    })
  })

  account.on('post:signin', function (options) {
    options.hooks.push(function () {
      callOrder.push(3)
    })
  })

  account.on('signin', function () {
    callOrder.push(2)
  })

  account.signIn(options)

  .then(function () {
    callOrder.push(4)

    t.is(callOrder.length, 4, '4 checkpoints')
    t.deepEqual(callOrder, callOrder.sort(), 'hooks get called in correct order')
  })

  .catch(t.error)
})

test('sign in with throw in pre hook', function (t) {
  store.clear()
  t.plan(1)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  account.on('pre:signin', function (options) {
    options.hooks.push(function () {
      throw new Error('signin aborted')
    })
  })

  account.on('signin', function () {
    t.fail('should not trigger "signin" event')
  })

  account.signIn(options)

  .then(t.error.bind(null, 'should reject'))

  .catch(function (error) {
    t.is(error.message, 'signin aborted', 'rejects with error from pre hook')
  })
})

test('sign in with throw in post hook', function (t) {
  store.clear()
  t.plan(2)

  nock(baseURL)
    .put('/session')
    .reply(201, signInResponse)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  account.on('post:signin', function (options) {
    options.hooks.push(function () {
      throw new Error('post:signin ooops')
    })
  })

  account.on('signin', function () {
    t.pass('"signin" event triggered')
  })

  account.signIn(options)

  .then(t.error.bind(null, 'should reject'))

  .catch(function (error) {
    t.is(error.message, 'post:signin ooops', 'rejects with error from post hook')
  })
})

test('sign out with pre & post hooks', function (t) {
  store.setObject('account', {
    username: 'chicken@docs.com',
    session: {
      id: 'Session'
    },
    id: 'abc4567'
  })
  t.plan(2)

  nock(baseURL)
    .delete('/session')
    .reply(204)

  var callOrder = []
  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  account.on('pre:signout', function (options) {
    options.hooks.push(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          callOrder.push(1)
          resolve()
        }, 100)
      })
    })
  })

  account.on('post:signout', function (options) {
    options.hooks.push(function () {
      callOrder.push(3)
    })
  })

  account.on('signout', function () {
    callOrder.push(2)
  })

  account.signOut()

  .then(function () {
    callOrder.push(4)

    t.is(callOrder.length, 4, '4 checkpoints')
    t.deepEqual(callOrder, callOrder.sort(), 'hooks get called in correct order')
  })

  .catch(t.error)
})

test('sign out with throw in pre hook', function (t) {
  store.setObject('account', {
    username: 'chicken@docs.com',
    session: {
      id: 'Session'
    },
    id: 'abc4567'
  })
  t.plan(1)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  account.on('pre:signout', function (options) {
    options.hooks.push(function () {
      throw new Error('signout aborted')
    })
  })

  account.on('signout', function () {
    t.fail('should not trigger "signout" event')
  })

  account.signOut()

  .then(t.error.bind(null, 'should reject'))

  .catch(function (error) {
    t.is(error.message, 'signout aborted', 'rejects with error from pre hook')
  })
})

test('sign out with throw in post hook', function (t) {
  store.setObject('account', {
    username: 'chicken@docs.com',
    session: {
      id: 'Session'
    },
    id: 'abc4567'
  })
  t.plan(2)

  nock(baseURL)
    .delete('/session')
    .reply(204)

  var account = new Account({
    url: baseURL,
    id: 'abc4567'
  })

  account.on('post:signout', function (options) {
    options.hooks.push(function () {
      throw new Error('post:signout ooops')
    })
  })

  account.on('signout', function () {
    t.pass('"signout" event triggered')
  })

  account.signOut()

  .then(t.error.bind(null, 'should reject'))

  .catch(function (error) {
    t.is(error.message, 'post:signout ooops', 'rejects with error from post hook')
  })
})
