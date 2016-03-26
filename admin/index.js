module.exports = AccountAdmin

var EventEmitter = require('events').EventEmitter

var getAccount = require('../utils/get-account')

var getUsername = require('../lib/username')
var signIn = require('../lib/sign-in')
var signOut = require('../lib/sign-out')
var isSignedIn = require('../lib/is-signed-in')

var accountsAdd = require('./lib/accounts/add')
var accountsFind = require('./lib/accounts/find')
var accountsFindAll = require('./lib/accounts/find-all')
var accountsUpdate = require('./lib/accounts/update')
var accountsRemove = require('./lib/accounts/remove')

var sessionsAdd = require('./lib/sessions/add')

var events = require('../lib/events')

function AccountAdmin (options) {
  if (!(this instanceof AccountAdmin)) {
    return new AccountAdmin(options)
  }

  if (!options || !options.url) {
    throw new Error('options.url is required')
  }

  var cacheKey = options.cacheKey || 'account_admin'
  var emitter = options.emitter || new EventEmitter()
  var accountsEmitter = new EventEmitter()
  var state = {
    accountsEmitter: accountsEmitter,
    cacheKey: cacheKey,
    emitter: emitter,
    account: getAccount({cacheKey: cacheKey}),
    url: options.url
  }

  var admin = {
    get username () {
      return getUsername(state)
    },
    signIn: function (options) {
      return signIn(state, options)

      .then(function (session) {
        // TODO: reject if user is not admin
        // depends on https://github.com/hoodiehq/hoodie-account-client/issues/26
        return session
      })
    },
    signOut: signOut.bind(null, state),
    isSignedIn: isSignedIn.bind(null, state),

    accounts: {
      add: accountsAdd.bind(null, state),
      find: accountsFind.bind(null, state),
      findAll: accountsFindAll.bind(null, state),
      update: accountsUpdate.bind(null, state),
      remove: accountsRemove.bind(null, state),
      on: events.on.bind(null, {emitter: accountsEmitter}),
      one: events.one.bind(null, {emitter: accountsEmitter}),
      off: events.off.bind(null, {emitter: accountsEmitter})
    },

    on: events.on.bind(null, state),
    one: events.one.bind(null, state),
    off: events.off.bind(null, state)
  }

  // sessions.add can use accounts.find to lookup user id by username
  admin.sessions = {
    add: sessionsAdd.bind(admin, state)
  }

  return admin
}
