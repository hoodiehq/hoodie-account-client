module.exports = Account

var events = require('./lib/events')

var getState = require('./utils/get-state')

function Account (options) {
  if (!(this instanceof Account)) {
    return new Account(options)
  }

  var state = getState(options)

  var api = {
    signUp: require('./lib/sign-up').bind(null, state),
    signIn: require('./lib/sign-in').bind(null, state),
    signOut: require('./lib/sign-out').bind(null, state),
    destroy: require('./lib/destroy').bind(null, state),
    get: require('./lib/get').bind(null, state),
    update: require('./lib/update').bind(null, state),
    profile: {
      get: require('./lib/profile-get').bind(null, state),
      update: require('./lib/profile-update').bind(null, state)
    },
    request: require('./lib/request').bind(null, state),
    on: events.on.bind(null, state),
    one: events.one.bind(null, state),
    off: events.off.bind(null, state),
    hook: state.hook.api,
    validate: require('./lib/validate').bind(null, state)
  }

  return api
}
