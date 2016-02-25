var test = require('tape')
var EventEmitter = require('events').EventEmitter

var events = require('../../lib/events.js')

test('subscribe to events once', function (t) {
  t.plan(1)

  var state = {
    emitter: new EventEmitter()
  }

  events.one(state, 'event', function () { t.pass() })

  state.emitter.emit('event')
  state.emitter.emit('event')
})

test('subscribe and unsubscribe to events', function (t) {
  t.plan(2)

  var pass = function () {
    t.pass()
  }

  var state = {
    emitter: new EventEmitter()
  }

  events.on(state, 'event', pass)

  state.emitter.emit('event')
  state.emitter.emit('event')

  events.off(state, 'event', pass)

  state.emitter.emit('event')
})
