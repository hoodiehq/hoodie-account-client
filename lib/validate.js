module.exports = validate

var Promise = require('lie')

function validate (state, options) {
  var self = this
  return new Promise(function (resolve, reject) {
    var result

    try {
      result = state.validate.call(self, options)
    } catch (error) {
      reject(error)
    }

    if (result && result.then) {
      return result.then(resolve, reject)
    }

    resolve()
  })
}
