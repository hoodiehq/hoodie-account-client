var simple = require('simple-mock')
var test = require('tape')

var getState = require('../../utils/get-state.js')

test('throws error on account.id conflict', function (t) {
  var options = {
    url: 'example.com',
    id: '567xyz',
    cache: {
      get: simple.stub().resolveWith({
        id: 'otherid'
      })
    }
  }

  getState(options).setup

  .then(t.fail.bind(null, 'should not resolve'))

  .catch(function (error) {
    t.is(error.message, 'Error while initialising: account.id conflict')
    t.end()
  })
})
