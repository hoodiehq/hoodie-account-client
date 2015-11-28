var test = require('tape')

var username = require('../../lib/username')

test('.username with empty state', function (t) {
  t.is(username({}), undefined, 'returns undefined')

  t.end()
})

test('.username with state: session.account.username = "pat"}', function (t) {
  t.is(username({
    session: {
      account: {
        username: 'pat'
      }
    }
  }), 'pat', 'returns undefined')

  t.end()
})
