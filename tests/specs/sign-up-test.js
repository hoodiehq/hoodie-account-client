var test = require('tape')
var nock = require('nock')
var merge = require('lodash.merge')

var Account = require('../../index')

var baseURL = 'http://localhost:3000'
var signUpResponse = require('../fixtures/signup.json')
var options = {
  username: signUpResponse.data.attributes.username,
  password: 'secret'
}
var profileData = {
  profile: {
    fullName: 'Docs Chicken'
  }
}

test('signUp w/o required options', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  account.signUp()

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('signUp w/o required password', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  account.signUp({
    username: options.username
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('signUp w/o required username', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  account.signUp({
    password: options.password
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('successful account.signUp(options)', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .reply(201, JSON.stringify(signUpResponse))

  account.signUp(options)

  .then(function (returnedObject) {
    t.is(returnedObject.username, options.username, 'returns correct username')
    t.ok(returnedObject.id, 'returns account id')
  })
  .catch(function (error) {
    t.fail(error)
  })
})

test('account.signUp w/ profile options', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.throws(account.signUp.bind(null, merge({}, options, profileData)), 'throws profile options error')
})

test('account.signUp w/ invalid options', function (t) {
  t.plan(1)

  var validate = function (options) {
    if (options.password && options.password.length < 8) {
      throw new Error('Password must be 8 characters or more')
    }
  }
  var account = new Account({
    url: baseURL,
    validate: validate
  })

  t.throws(account.signUp.bind(null, options), 'throws missing password error')
})

test('account.signUp w/ errors', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  nock(baseURL)
    .put('/session/account')
    .replyWithError({'message': 'username taken'})

  account.signUp(options)

  .catch(function (error) {
    t.is(typeof error, 'object', 'returns error object')
  })
})
