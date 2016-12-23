module.exports = getId

function getId (state) {
  if (!state.account) {
    throw new Error('account.id not yet accessible, wait for account.ready to resolve')
  }
  return state.account.id
}
