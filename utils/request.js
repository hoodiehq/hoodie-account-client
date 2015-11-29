module.exports = request

var nets = require('nets')
var set = require('lodash.set')

var Promise = require('./promise')

function request (options) {
  options.encoding = undefined

  return new Promise(function (resolve, reject) {
    options.json = true
    set(options, 'headers.accept', 'application/vnd.api+json')
    if (options.body) {
      set(options, 'headers.content-type', 'application/vnd.api+json')
    }
    nets(options, function (error, response) {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}
