var test = require('tape')

var get = require('../../utils/get-properties')
var object = {
  funky: 'fresh',
  foo: {
    bar: 'baz'
  },
  nana: 'nana'
}

test('getProperties without path', function (t) {
  var result = get(object, undefined)

  t.deepEqual(result, object, 'contains correct object')

  t.end()
})

test('get one property', function (t) {
  var result = get(object, 'funky')

  t.equal(result, 'fresh', 'returns value')

  t.end()
})

test('get one deep property', function (t) {
  var result = get(object, 'foo.bar')

  t.equal(result, 'baz', 'returns value')

  t.end()
})

test('get multiple properties', function (t) {
  var result = get(object, ['funky', 'foo.bar'])

  t.deepEqual(result, {
    funky: 'fresh',
    foo: {
      bar: 'baz'
    }
  }, 'returns object with properties')

  t.end()
})
