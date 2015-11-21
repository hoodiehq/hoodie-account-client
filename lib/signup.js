module.exports = signUp

var request = require('../helpers/request')
var Promise = require('../helpers/promise')
var saveSession = require('../helpers/save-session')
var deserialize = require('../helpers/deserialize')
var serialize = require('../helpers/serialize')

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
    body: JSON.stringify(serialize('account', options))
  })

  .then(function (response) {
    var data = JSON.parse(response.body)
    data = deserialize(data, {
      relationships: ['profile']
    })

    saveSession(state, data, 'account')
    saveSession(state, { id: data.profile.id }, 'profile')

    return {
      id: state.session.account.id,
      username: state.session.account.username
    }
  })
}

