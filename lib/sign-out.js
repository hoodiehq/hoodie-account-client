module.exports = signOut

var clone = require('lodash/clone')
var invokeMap = require('lodash/invokeMap')

var internals = module.exports.internals = {}
internals.request = require('../utils/request')
internals.clearSession = require('../utils/clear-session')
internals.get = require('./get')
internals.isSignedIn = require('./is-signed-in')

function signOut (state) {
  if (!internals.isSignedIn(state)) {
    return Promise.reject(new Error('UnauthenticatedError: Not signed in'))
  }

  var accountProperties = internals.get(state)

  var preHooks = []
  // note: the `pre:signout` & `post:signout` events are not considered public
  //       APIs and might change in future without notice
  //       https://github.com/hoodiehq/hoodie-account-client/issues/65
  state.emitter.emit('pre:signout', { hooks: preHooks })

  return Promise.resolve()

  .then(function () {
    return Promise.all(invokeMap(preHooks, 'call'))
  })

  .then(function () {
    return internals.request({
      method: 'DELETE',
      url: state.url + '/session',
      headers: {
        authorization: 'Session ' + state.account.session.id
      }
    })
  })

  .then(function () {
    internals.clearSession({
      cacheKey: state.cacheKey
    })

    var accountClone = clone(state.account)

    delete state.account

    state.emitter.emit('signout', accountClone)

    var postHooks = []

    // note: the `pre:signout` & `post:signout` events are not considered public
    //       APIs and might change in future without notice
    //       https://github.com/hoodiehq/hoodie-account-client/issues/65
    state.emitter.emit('post:signout', { hooks: postHooks })

    return Promise.all(invokeMap(postHooks, 'call'))

    .then(function () {
      return clone(accountProperties)
    })
  })
}
