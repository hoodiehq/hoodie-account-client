module.exports = generateId

// uuids consist of numbers and lowercase letters only.
// We stick to lowercase letters to prevent confusion
// and to prevent issues with CouchDB, e.g. database
// names only allow for lowercase letters.
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
var LENGTH = 7

function generateId () {
  var id = ''
  var radix = CHARS.length

  for (var i = 0; i < LENGTH; i++) {
    var rand = Math.random() * radix
    var c = CHARS[Math.floor(rand)]
    id += String(c).charAt(0)
  }

  return id
}
