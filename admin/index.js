module.exports = AccountAdmin

var getSession = require('../utils/get-session')

var getUsername = require('../lib/username')
var signIn = require('../lib/signin')
var signOut = require('../lib/signout')
var isSignedIn = require('../lib/is-signedin')

var accountsAdd = require('./lib/accounts/add')
var accountsFind = require('./lib/accounts/find')
var accountsFindAll = require('./lib/accounts/find-all')
var accountsUpdate = require('./lib/accounts/update')
var accountsRemove = require('./lib/accounts/remove')

function AccountAdmin (options) {
  if (!(this instanceof AccountAdmin)) {
    return new AccountAdmin(options)
  }

  if (!options || !options.url) {
    throw new Error('options.url is required')
  }

  var cacheKey = options.cacheKey || '_session_admin'
  var state = {
    cacheKey: cacheKey,
    url: options.url,
    validate: options.validate || function () {},
    session: getSession({cacheKey: cacheKey})
  }

  return {
    get username () {
      return getUsername(state)
    },
    signIn: function (options) {
      return signIn(state, options)

      .then(function (session) {
        // TODO: reject if user is not admin
        // depends on https://github.com/hoodiehq/hoodie-client-account/issues/26
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
      remove: accountsRemove.bind(this, state)
    }
  }
}
