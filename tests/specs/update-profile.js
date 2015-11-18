var test = require('tape')
var nock = require('nock')

var Account = require('../../index')
var updateProfile = require('../../lib/update-profile')

var baseURL = 'http://localhost:3000'
var state = {
  url: baseURL,
  session: {
    id: 'sessionId123',
    account: {
      id: 'abcd1234',
      profile: {
        id: 'abcd1234-profile'
      }
    }
  }
}

test('profile has "update" methods', function (t) {
  t.plan(1)

  var account = new Account({
    url: baseURL
  })

  t.is(typeof account.profile.update, 'function', 'has "update()"')
})

test('throws when no options', function (t) {
  t.plan(1)

  t.throws(updateProfile.bind(null, state), 'throws error')
})

test('update profile property', function (t) {
  t.plan(2)

  var options = {
    fullName: 'Documents Chicken'
  }

  nock(baseURL)
    .patch('/session/account/profile')
    .reply(204)

  updateProfile(state, options)

  .then(function (newPropObject) {
    t.is(typeof newPropObject, 'object', 'returns prop object')
    t.equal(newPropObject, options, 'returns correct object')
  })

  .catch(t.fail)
})
