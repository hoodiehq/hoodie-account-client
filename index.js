module.exports = Account

var getUsername = require('./lib/username')
var getId = require('./lib/id')
var events = require('./lib/events')

var getState = require('./utils/get-state')

function Account (options) {
  if (!(this instanceof Account)) {
    return new Account(options)
  }

  var state = getState(options)

  return {
    get username () {
      return getUsername(state)
    },
    get id () {
      return getId(state)
    },
    signUp: require('./lib/sign-up').bind(this, state),
    signIn: require('./lib/sign-in').bind(this, state),
    signOut: require('./lib/sign-out').bind(this, state),
    isSignedIn: require('./lib/is-signed-in').bind(this, state),
    get: require('./lib/get').bind(this, state),
    fetch: require('./lib/fetch').bind(this, state, 'account'),
    update: require('./lib/update').bind(this, state),
    profile: {
      get: require('./lib/profile-get').bind(this, state),
      fetch: require('./lib/fetch').bind(this, state, 'account.profile'),
      update: require('./lib/update-profile').bind(this, state)
    },
    request: require('./lib/request').bind(this, state),
    on: events.on.bind(this, state),
    one: events.one.bind(this, state),
    off: events.off.bind(this, state),
    validate: require('./lib/validate').bind(this, state)
  }
}
