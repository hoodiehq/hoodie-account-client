module.exports = request

var Promise = require('./promise')
var nets = require('nets')

function request (options) {
  options.encoding = undefined

  return new Promise(function (resolve, reject) {
    nets(options, function (error, response) {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}
