module.exports = serialise

function serialise (type, attributes, id) {
  if (!type || !attributes) {
    throw new Error('Serialisation must include a type and some attributes.')
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
