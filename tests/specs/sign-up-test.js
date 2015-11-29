var simple = require('simple-mock')
var test = require('tape')

var signUp = require('../../lib/sign-up')

test('signUp without options', function (t) {
  t.plan(1)

  signUp({})

  .catch(t.pass.bind(t, 'rejects'))
})

test('signUp without password', function (t) {
  t.plan(1)

  signUp({}, {
    username: 'pat'
  })

  .catch(t.pass.bind(t, 'rejects'))
})

test('signUp without username', function (t) {
  t.plan(1)

  signUp({}, {
    password: 'secret'
  })

  .catch(t.pass.bind(t, 'rejects'))
})

test('signUp with username & password', function (t) {
  t.plan(6)

  var state = {
    url: 'http://example.com',
    validate: simple.stub()
  }

  simple.mock(signUp.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(signUp.internals, 'serialise').returnWith('serialise return')
  simple.mock(signUp.internals, 'deserialise').returnWith({
    id: 'deserialise id',
    username: 'deserialise username'
  })

  signUp(state, {
    username: 'pat',
    password: 'secret'
  })

  .then(function (result) {
    t.deepEqual(state.validate.lastCall.arg, {
      username: 'pat',
      password: 'secret'
    })
    t.deepEqual(signUp.internals.serialise.lastCall.args, [
      'account',
      {
        username: 'pat',
        password: 'secret'
      }
    ])
    t.deepEqual(signUp.internals.request.lastCall.arg, {
      method: 'PUT',
      url: 'http://example.com/session/account',
      body: 'serialise return'
    })
    t.deepEqual(signUp.internals.deserialise.lastCall.args, [
      'response body',
      { include: 'profile' }
    ])

    t.is(result.id, 'deserialise id', 'resolves with account id')
    t.is(result.username, 'deserialise username', 'resolves with account username')

    simple.restore()
  })
  .catch(t.error)
})

test.skip('signUp with profile', function (t) {
  t.plan(1)

  var state = {
    validate: function () {}
  }

  signUp(state, {
    username: 'pat',
    password: 'secret',
    profile: {}
  })

  .then(t.fail.bind(t, 'must throw'))

  .catch(t.pass.bind(t, 'throws error'))
})

test.skip('account.signUp with invalid options', function (t) {
  t.plan(1)

  var state = {
    validate: function (options) {
      throw new Error('Not funky enough!')
    }
  }

  signUp(state, {
    username: 'pat',
    password: 'secret'
  })

  .then(t.fail.bind(t, 'must throw'))

  .catch(function (error) {
    t.is(error.message, 'Not funky enough!', 'throws error')
  })
})

test('signUp with request error', function (t) {
  t.plan(1)

  var state = {
    validate: function () {}
  }

  simple.mock(signUp.internals, 'request').rejectWith(new Error('Ooops'))

  signUp(state, {
    username: 'pat',
    password: 'secret'
  })

  .then(t.fail.bind(t, 'must throw'))

  .catch(function (error) {
    t.is(typeof error, 'object', 'returns error object')
  })
})
