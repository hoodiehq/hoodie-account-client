module.exports = destroy

var omit = require('lodash/omit')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.get = require('./get')

function destroy (state) {
  return state.setup

  .then(function () {
    return state.cache.get()
  })

  .then(function (cache) {
    var promise = Promise.resolve()
    if (internals.get(state, 'session')) {
      promise = promise.then(function () {
        internals.request({
          method: 'DELETE',
          url: state.url + '/session/account',
          headers: {
            authorization: 'Session ' + cache.session.id
          }
        })
      })
    }

    return promise.then(function () {
      state.cache.unset()

      var account = omit(cache, 'session')
      state.emitter.emit('signout', account)
      state.emitter.emit('destroy', account)

      return account
    })
  })
}
