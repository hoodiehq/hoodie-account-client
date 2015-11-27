module.exports = signUp

var request = require('../helpers/request')
var Promise = require('../helpers/promise')
var saveSession = require('../helpers/save-session')
var deserialise = require('../helpers/deserialise')
var serialise = require('../helpers/serialise')

function signUp (state, options) {
  if (!options || !options.username || !options.password) {
    return Promise.reject(new Error('options.username and options.password is required'))
  }

  state.validate(options)

  if (options.profile) {
    throw new Error('SignUp with profile data not yet implemented. Please see https://github.com/hoodiehq/hoodie-client-account/issues/11.')
  }

  return request({
    url: state.url + '/session/account',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    },
    body: JSON.stringify(serialise('account', options))
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    data = deserialise(data, {
      include: 'profile'
    })

    saveSession(state, data, 'account')
    saveSession(state, { id: data.profile.id }, 'profile')

    return {
      id: state.session.account.id,
      username: state.session.account.username
    }
  })
}
