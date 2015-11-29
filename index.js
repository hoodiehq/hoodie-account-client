module.exports = Account

var getUsername = require('./lib/username')

var getSession = require('./utils/get-session')

function Account (options) {
  if (!(this instanceof Account)) {
    return new Account(options)
  }

  if (!options || !options.url) {
    throw new Error('options.url is required')
  }

  var state = {
    cacheKey: options.cacheKey || '_session',
    url: options.url,
    validate: options.validate || function () {}
  }

  getSession(state)

  return {
    get username () {
      return getUsername(state)
    },
    signUp: require('./lib/signup').bind(this, state),
    signIn: require('./lib/signin').bind(this, state),
    signOut: require('./lib/signout').bind(this, state),
    isSignedIn: require('./lib/is-signedin').bind(this, state),
    get: require('./lib/get').bind(this, state),
    fetch: require('./lib/fetch').bind(this, state, 'account'),
    profile: {
      get: require('./lib/profile-get').bind(this, state),
      fetch: require('./lib/fetch').bind(this, state, 'account.profile'),
      update: require('./lib/update-profile').bind(this, state)
    }
  }
}
