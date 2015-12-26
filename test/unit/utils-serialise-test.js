var test = require('tape')

var serialise = require('../../utils/serialise')

test('throws error when no type is passed', function (t) {
  t.throws(serialise.bind(null), 'throws error')

  t.end()
})

test('throws error when no attribute is passed', function (t) {
  t.throws(serialise.bind(null, 'account'), 'throws error')

  t.end()
})

test('returns JSON API serialised object', function (t) {
  var type = 'account'
  var attributes = {
    username: 'docs@chicken.com'
  }
  var id = 'account1234'

  var body = serialise(type, attributes, id)

  t.is(body.data.id, id, 'sets correct id')
  t.equal(body.data.attributes, attributes, 'sets correct attributes')
  t.is(body.data.type, type, 'set correct type')

  t.end()
})
