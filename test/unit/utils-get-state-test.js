var test = require('tape')

var getState = require('../../utils/get-state.js')

test('throws error on account.id conflict', function (t) {
  t.plan(1)

  var options = {
    url: 'example.com',
    id: '567xyz'
  }

  t.throws(function () {
    getState(options)
  }, 'Must reject')
})
