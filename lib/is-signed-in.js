module.exports = isSignedIn

function isSignedIn (state) {
  return !!state.account
}
