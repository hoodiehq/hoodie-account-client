var test = require('tape')
var nock = require('nock')

var Account = require('../../index')
var get = require('../../lib/get')
var fetch = require('../../lib/fetch')

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

test('has "get" and "fetch" methods', function (t) {
  t.plan(2)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.get, 'function', 'has "get()"')
  t.is(typeof account.fetch, 'function', 'has "fetch()"')
})

test('"get" account details', function (t) {
  t.plan(5)

  var returnedAccount = {
    session: {
      id: 'sessionid123',
      account: {
        username: options.username,
        profile: profile
      }
    }
  }

  var accountInfo = get(returnedAccount)

  t.is(typeof accountInfo, 'object', 'returns account object')
  t.is(accountInfo.username, returnedAccount.session.account.username, 'contains correct username')

  var city = get(returnedAccount, 'profile.address.city')
  t.is(city, returnedAccount.session.account.profile.address.city, 'returns requested profile property')

  var properties = get(returnedAccount, ['username', 'profile.nickName'])
  t.is(properties.username, returnedAccount.session.account.username, 'returns 1st requested property')
  t.is(properties.profile.nickname, returnedAccount.session.account.profile.nickname, 'returns 2nd requested property')
})

test('"fetch" account details', function (t) {
  t.plan(2)

  var returnedAccount = {
    url: baseURL,
    session: {
      id: 'sessionid123',
      account: {
        username: options.username,
        profile: profile
      }
    }
  }

  nock(baseURL)
    .get('/session/account')
    .reply(200, JSON.stringify(returnedAccount))

  fetch(returnedAccount)

  .then(function (accountInfo) {
    t.is(typeof accountInfo, 'object', 'returns account object')
    t.is(accountInfo.username, returnedAccount.session.account.username, 'contains correct username')
  })
})

test('"fetch" account property', function (t) {
  t.plan(1)

  var returnedAccount = {
    url: baseURL,
    session: {
      id: 'sessionid123',
      account: {
        username: options.username,
        profile: profile
      }
    }
  }

  nock(baseURL)
    .get('/session/account')
    .reply(200, JSON.stringify(returnedAccount))

  fetch(returnedAccount, 'profile.address.city')

  .then(function (city) {
    t.is(city, returnedAccount.session.account.profile.address.city, 'returns requested profile property')
  })
})

test('"fetch" account properties', function (t) {
  t.plan(2)

  var returnedAccount = {
    url: baseURL,
    session: {
      id: 'sessionid123',
      account: {
        username: options.username,
        profile: profile
      }
    }
  }

  nock(baseURL)
    .get('/session/account')
    .reply(200, JSON.stringify(returnedAccount))

  fetch(returnedAccount, ['username', 'profile.nickName'])

  .then(function (properties) {
    t.is(properties.username, returnedAccount.session.account.username, 'returns 1st requested property')
    t.is(properties.profile.nickname, returnedAccount.session.account.profile.nickname, 'returns 2nd requested property')
  })
})
