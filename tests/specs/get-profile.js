var test = require('tape')

var Account = require('../../index')
var get = require('../../lib/get')

var baseURL = 'http://localhost:3000'
var state = {
  session: {
    id: 'sessionId123',
    account: {
      username: 'docsChicken',
      profile: {
        'fullName': 'Docs Chicken',
        'favoriteClothing': 'Hoodie'
      }
    }
  }
}

test('profile has "get" methods', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.profile.get, 'function', 'has "get()"')
})

test('get profile details', function (t) {
  t.plan(2)

  var profileInfo = get(state, 'account.profile')

  t.is(typeof profileInfo, 'object', 'returns profile object')
  t.equal(profileInfo, state.session.account.profile, 'contains correct object')
})

test('get profile returns undefined when user not logged in', function (t) {
  t.plan(1)

  var profileInfo = get({}, 'account.profile')

  t.is(typeof profileInfo, 'undefined', 'returns undefined')
})

test('get profile fullName from string', function (t) {
  t.plan(2)

  var fullName = get(state, 'account.profile', 'fullName')

  t.is(typeof fullName, 'string', 'returns fullName string')
  t.equal(fullName, state.session.account.profile.fullName, 'contains correct property')
})

test('get profile fullName from array', function (t) {
  t.plan(2)

  var fullName = get(state, 'account.profile', ['fullName'])

  t.is(typeof fullName, 'string', 'returns fullName string')
  t.equal(fullName, state.session.account.profile.fullName, 'contains correct property')
})

test('get profile details from array', function (t) {
  t.plan(2)

  var profileInfo = get(state, 'account.profile', ['fullName', 'favoriteClothing'])

  t.true(Array.isArray(profileInfo), 'returns array')
  t.deepEqual(profileInfo, [state.session.account.profile.fullName, state.session.account.profile.favoriteClothing], 'contains correct profile info')
})
