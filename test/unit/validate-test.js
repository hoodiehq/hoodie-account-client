var test = require('tape')

var validate = require('../../lib/validate')

test('validate no-op', function (t) {
  t.plan(1)

  var state = {
    validate: function () {}
  }

  validate(state, {})

  .then(function () {
    t.pass('validate resolved successfully')
  })

  .catch(function (error) {
    t.fail(error)
  })
})

test('validate passes options into function', function (t) {
  t.plan(1)

  var state = {
    validate: function (options) {
      if (options) {
        t.pass('function received options successfully')
      } else {
        t.fail('no options available')
      }
    }
  }

  validate(state, {})

  .catch(function (error) {
    t.fail(error)
  })
})

test('validate rejects errors from function', function (t) {
  t.plan(1)

  var state = {
    validate: function () {
      throw new Error('sample error')
    }
  }

  validate(state, {})

  .then(function () {
    t.fail('validate did not reject')
  })

  .catch(function () {
    t.pass('validate rejected successfully')
  })
})

test('validate accepts Promises', function (t) {
  t.plan(1)

  var state = {
    validate: function () {
      return new Promise(function (resolve) {
        resolve()
      })
    }
  }

  validate(state, {})

  .then(function () {
    t.pass('resolves successfully')
  })

  .catch(function (error) {
    t.fail(error)
  })
})
