var test = require('tape')
var nock = require('nock')

var Account = require('../../index')
var merge = require('lodash.merge')

var baseURL = 'http://localhost:3000'
var options = {
  username: 'jane@example.com',
  password: 'secret'
}
var profile = {
  firstName: 'Jane',
  lastName: 'Doe',
  nickName: 'JD',
  address: {
    city: 'New York',
    state: 'NY',
    country: 'United States'
  }
}

test('has "isSignedIn" method', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.isSignedIn, 'function', 'has "isSignedIn()"')
})

test('returns correct signedIn state', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL
  })

  var accountWithProfile = merge(options, {profile: profile})
  var returnedAccount = {
    username: options.username,
    session: {
      id: 'sessionid123'
    },
    profile: profile
  }

  nock(baseURL)
    .put('/session/account')
    .reply(200, JSON.stringify(returnedAccount))
    .put('/session')
    .reply(201, JSON.stringify(returnedAccount.session))
    .delete('/session')
    .reply(204)

  account.signUp(accountWithProfile)

  .then(function () {
    return account.signIn(options)
  })

  .then(function () {
    t.is(account.isSignedIn(), true, 'returns true after signIn()')

    return account.signOut()
  })

  .then(function () {
    t.is(account.isSignedIn(), false, 'returns false after signOut()')
  })
})
