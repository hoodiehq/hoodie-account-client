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
    signUp: require('./lib/sign-up').bind(null, state),
    signIn: require('./lib/sign-in').bind(null, state),
    signOut: require('./lib/sign-out').bind(null, state),
    destroy: require('./lib/destroy').bind(null, state),
    isSignedIn: require('./lib/is-signed-in').bind(null, state),
    hasInvalidSession: require('./lib/has-invalid-session').bind(null, state),
    get: require('./lib/get').bind(null, state),
    fetch: require('./lib/fetch').bind(null, state),
    update: require('./lib/update').bind(null, state),
    profile: {
      get: require('./lib/profile-get').bind(null, state),
      fetch: require('./lib/profile-fetch').bind(null, state),
      update: require('./lib/profile-update').bind(null, state)
    },
    request: require('./lib/request').bind(null, state),
    on: events.on.bind(null, state),
    one: events.one.bind(null, state),
    off: events.off.bind(null, state),
    validate: require('./lib/validate').bind(null, state)
  }
}
