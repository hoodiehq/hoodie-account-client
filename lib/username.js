module.exports = username

function username (state) {
  if (!state.account) {
    throw new Error('account.username not yet accessible, wait for account.ready to resolve')
  }
  return state.account.username
}
