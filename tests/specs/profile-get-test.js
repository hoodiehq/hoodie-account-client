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
  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.profile.get, 'function', 'has "get()"')

  t.end()
})

test('get profile details', function (t) {
  var profileInfo = get(state, 'account.profile')

  t.is(typeof profileInfo, 'object', 'returns profile object')
  t.equal(profileInfo, state.session.account.profile, 'contains correct object')

  t.end()
})

test('get profile returns undefined when user not logged in', function (t) {
  var profileInfo = get({}, 'account.profile')

  t.is(typeof profileInfo, 'undefined', 'returns undefined')

  t.end()
})

test('get profile fullName from string', function (t) {
  var fullName = get(state, 'account.profile', 'fullName')

  t.is(typeof fullName, 'string', 'returns fullName string')
  t.equal(fullName, state.session.account.profile.fullName, 'contains correct property')

  t.end()
})

test('get profile fullName from array', function (t) {
  var result = get(state, 'account.profile', ['fullName'])

  t.is(typeof result, 'object', 'returns object')
  t.deepEqual(result, {
    fullName: state.session.account.profile.fullName
  }, 'contains correct property')

  t.end()
})

test('get profile details from array', function (t) {
  var result = get(state, 'account.profile', ['fullName', 'favoriteClothing'])

  t.is(typeof result, 'object', 'returns object')
  t.deepEqual(result, {
    fullName: state.session.account.profile.fullName,
    favoriteClothing: state.session.account.profile.favoriteClothing
  }, 'contains correct profile info')

  t.end()
})
