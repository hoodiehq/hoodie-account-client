module.exports = serialize

function serialize (type, attributes, id) {
  if (!type || !attributes) {
    throw new Error('Serialization must include a type and some attributes.')
  }
  var data = {
    type: type,
    attributes: attributes
  }

  if (id) {
    data.id = id
  }

  return { data: data }
}
