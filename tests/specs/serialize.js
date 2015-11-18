var test = require('tape')

var serialize = require('../../helpers/serialize')

test('throws error when no type is passed', function (t) {
  t.plan(1)

  t.throws(serialize.bind(null), 'throws error')
})

test('throws error when no attribute is passed', function (t) {
  t.plan(1)

  t.throws(serialize.bind(null, 'account'), 'throws error')
})

test('returns JSON API serialized object', function (t) {
  t.plan(3)

  var type = 'account'
  var attributes = {
    username: 'docs@chicken.com'
  }
  var id = 'account1234'

  var body = serialize(type, attributes, id)

  t.is(body.data.id, id, 'sets correct id')
  t.equal(body.data.attributes, attributes, 'sets correct attributes')
  t.is(body.data.type, type, 'set correct type')
})

