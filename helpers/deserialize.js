module.exports = deserialize

function deserialize (response, options) {
  if (!response || !response.data) {
    throw new Error('Please include a JSON API response to deserialize.')
  }

  var data = resourceParser(response.data, options || {})

  return data
}

function resourceParser (resource, options) {
  var data = {
    id: resource.id
  }

  if (resource.attributes) {
    Object.keys(resource.attributes).forEach(function (attribute) {
      data[attribute] = resource.attributes[attribute]
    })
  }

  if (options.relationships) {
    options.relationships.forEach(function (relationship) {
      data[relationship] = deserialize(resource.relationships[relationship])
    })
  }

  return data
}
