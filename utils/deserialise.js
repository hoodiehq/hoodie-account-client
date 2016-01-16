module.exports = deserialise

var merge = require('lodash/merge')
var filter = require('lodash/filter')

function deserialise (response, options) {
  if (!response || !response.data) {
    throw new Error('Please include a JSON API response to deserialise.')
  }

  return Array.isArray(response.data)
    ? deserialiseMany(options || {}, response)
    : deserialiseOne(options || {}, response)
}

function deserialiseOne (options, response) {
  var resource = response.data
  var properties = {}
  options = merge({}, options)

  if (resource.type !== 'profile') {
    properties.id = resource.id
  }

  if (options.include) {
    var tmp = options.include.indexOf('.')
    var currentInclude = options.include.substr(0, tmp)
    var nextInclude = options.include.substr(tmp + 1)
    if (tmp === -1) {
      currentInclude = nextInclude
      nextInclude = ''
    }

    if (resource.relationships) {
      var relationship = resource.relationships[currentInclude].data
      var includedResource = filter(response.included, {
        type: relationship.type,
        id: relationship.id
      })[0]
      if (includedResource) {
        options.include = nextInclude
        properties[currentInclude] = deserialiseOne(options, {
          included: response.included,
          data: includedResource
        })
      }
    }
  }

  if (resource.attributes) {
    Object.keys(resource.attributes).forEach(function (attribute) {
      properties[attribute] = resource.attributes[attribute]
    })
  }

  return properties
}

function deserialiseMany (options, response) {
  return response.data.map(function (resource) {
    return deserialiseOne(options, {
      included: response.included,
      data: resource
    })
  })
}
