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
    signOut: signOut.bind(this, state),
    isSignedIn: isSignedIn.bind(this, state),

    accounts: {
      add: accountsAdd.bind(this, state),
      find: accountsFind.bind(this, state),
      findAll: accountsFindAll.bind(this, state),
      update: accountsUpdate.bind(this, state),
      remove: accountsRemove.bind(this, state),
      on: events.on.bind(this, {emitter: accountsEmitter}),
      one: events.one.bind(this, {emitter: accountsEmitter}),
      off: events.off.bind(this, {emitter: accountsEmitter})
    },

    on: events.on.bind(this, state),
    one: events.one.bind(this, state),
    off: events.off.bind(this, state)
  }

  // sessions.add can use accounts.find to lookup user id by username
  admin.sessions = {
    add: sessionsAdd.bind(admin, state)
  }

  return admin
}
