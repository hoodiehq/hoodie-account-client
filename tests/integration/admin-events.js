var nock = require('nock')
var simple = require('simple-mock')
var store = require('humble-localstorage')
var test = require('tape')

var AccountAdmin = require('../../admin/index')

var accountResponse = require('../fixtures/admin-account')

test('admin events', function (t) {
  t.plan(5)

  store.setObject('account_admin', {
    username: 'patmin',
    session: {
      id: 'abc4567'
    }
  })

  nock('http://localhost:3000')
    .post('/accounts')
    .reply(201, accountResponse)
    .get('/accounts/abc1234').twice()
    .reply(200, accountResponse)
    .patch('/accounts/abc1234')
    .reply(204)
    .delete('/accounts/abc1234')
    .reply(204)

  var admin = new AccountAdmin({
    url: 'http://localhost:3000'
  })

  var addHandler = simple.stub()
  var updateHandler = simple.stub()
  var removeHandler = simple.stub()
  var changeHandler = simple.stub()
  admin.accounts.on('add', addHandler)
  admin.accounts.on('update', updateHandler)
  admin.accounts.on('remove', removeHandler)
  admin.accounts.on('change', changeHandler)

  t.ok(admin.isSignedIn(), 'pre condition: signed in')

  admin.accounts.add({
    username: 'sam',
    password: 'secret'
  })

  .then(function () {
    return admin.accounts.update('abc1234', {
      username: 'pat'
    })
  })

  .then(function () {
    return admin.accounts.remove('abc1234')
  })

  .then(function () {
    t.is(addHandler.callCount, 1, '"add" event triggered once')
    t.is(updateHandler.callCount, 1, '"update" event triggered once')
    t.is(removeHandler.callCount, 1, '"remove" event triggered once')
    t.is(changeHandler.callCount, 3, '"change" event triggered three times')
  })

  .catch(t.error)
})
