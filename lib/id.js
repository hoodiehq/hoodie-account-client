module.exports = getId

var generateId = require('../utils/generate-id')

function getId (state) {
  if (!state.account) {
    state.account = {
      id: generateId()
    }
    state.store.set(state.account)
  }
  return state.account.id
}
