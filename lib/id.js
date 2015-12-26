module.exports = getId

var generateId = require('../utils/generate-id')
var saveAccount = require('../utils/save-account')

function getId (state) {
  if (!state.account) {
    state.account = {
      id: generateId()
    }
    saveAccount({
      cacheKey: state.cacheKey,
      account: state.account
    })
  }
  return state.account.id
}
