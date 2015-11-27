module.exports = AccountAdmin

var getSession = require('../helpers/get-session')
var signIn = require('../lib/signin')
var signOut = require('../lib/signout')
var isSignedIn = require('../lib/is-signedin')

var accountsFindAll = require('./lib/accounts/find-all')

function AccountAdmin (options) {
  if (!(this instanceof AccountAdmin)) {
    return new AccountAdmin(options)
  }

  if (!options || !options.url) {
    throw new Error('options.url is required')
  }

  var state = {
    cacheKey: options.cacheKey || '_session_admin',
    url: options.url,
    validate: options.validate || function () {}
  }

  getSession(state)

  return {
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
      findAll: accountsFindAll.bind(this, state)
    }
  }
}
