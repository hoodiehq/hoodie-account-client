module.exports = signIn

var Promise = require('lie')
var clone = require('lodash/clone')
var get = require('lodash/get')
var invokeMap = require('lodash/invokeMap')

var internals = module.exports.internals = {}
internals.deserialise = require('../utils/deserialise')
internals.request = require('../utils/request')
internals.saveAccount = require('../utils/save-account')
internals.serialise = require('../utils/serialise')

function signIn (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  var preHooks = []
  // note: the `pre:signin` & `post:signin` events are not considered public
  //       APIs and might change in future without notice
  //       https://github.com/hoodiehq/hoodie-account-client/issues/65
  state.emitter.emit('pre:signin', { hooks: preHooks })

  return Promise.resolve()

  .then(function () {
    return Promise.all(invokeMap(preHooks, 'call'))
  })

  .then(function () {
    return internals.request({
      url: state.url + '/session',
      method: 'PUT',
      body: internals.serialise('session', options)
    })
  })

  .then(function (response) {
    var data = internals.deserialise(response.body, {
      include: 'account'
    })

    // admins don’t have an account
    if (!data.account) {
      data.account = {
        username: options.username
      }
    }

    // If the username hasn’t changed, emit 'reauthenticate' instead of 'signin'
    var emitEvent = 'signin'
    if (get(state, 'account.username') === options.username) {
      emitEvent = 'reauthenticate'
    }

    state.account = {
      username: data.account.username,
      session: {
        id: data.id
      }
    }

    if (data.account.id) {
      state.account.id = data.account.id
    }

    internals.saveAccount({
      cacheKey: state.cacheKey,
      account: state.account
    })

    state.emitter.emit(emitEvent, clone(state.account))

    return data.account
  })

  .then(function (account) {
    var postHooks = []

    // note: the `pre:signin` & `post:signin` events are not considered public
    //       APIs and might change in future without notice
    //       https://github.com/hoodiehq/hoodie-account-client/issues/65
    state.emitter.emit('post:signin', { hooks: postHooks })

    return Promise.all(invokeMap(postHooks, 'call'))

    .then(function () {
      return clone(account)
    })
  })
}
