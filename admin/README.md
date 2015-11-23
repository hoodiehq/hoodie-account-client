# account admin client

The account admin client is a front-end API that wraps all
admin-specific RESTful API following the [account REST API](http://docs.accountjsonapi.apiary.io/)
specifications.

- all methods return promises
- where applicable methods support JSON API options:
  - `include`: string of comma-separated resources to include in response, or
    array of strings, see [JSON API: Inclusion of Related Resources](http://jsonapi.org/format/#fetching-includes)
  - `fields`: map of fields to include in response by type, see [JSON API: Sparse Fieldset](http://jsonapi.org/format/#fetching-sparse-fieldsets)
  - `sort`: string of comma-separated list of attributes to sort by, or array of strings, see [JSON API: Sorting](http://jsonapi.org/format/#fetching-sorting)
  - `page.offset` & `page.limit`: integer, see [JSON API: Pagination](http://jsonapi.org/format/#fetching-pagination)
- where applicable, methods support `options.auth` for per-request authentication,
  - `options.auth.username` & `options.auth.password`: credentials of user
    the request shall be authenticated with
  - `options.bearer`: bearer token of session the request shall be authenticated
    with


```js
var accountAdmin = new AccountAdmin('https://example.com/api')

accountAdmin.username
accountAdmin.isSignedIn()
accountAdmin.signIn(options)
accountAdmin.update(change)
accountAdmin.signOut()

accountAdmin.sessions.add(options)
accountAdmin.sessions.find(idOrObject, options)
accountAdmin.sessions.remove(idOrObject, options)

accountAdmin.accounts.add(object, options)
accountAdmin.accounts.find(idOrObject, options)
accountAdmin.accounts.findAll(options)
accountAdmin.accounts.update(idOrObject, change, options)
accountAdmin.accounts.remove(idOrObject, change, options)

accountAdmin.requests.add(object, options)
accountAdmin.requests.find(idOrObject, ptions)
accountAdmin.requests.findAll(options)
accountAdmin.requests.remove(idOrObject, change, options)

var account = accountAdmin.account(idOrObject)

account.profile.find(options)
account.profile.update(change, options)

account.tokens.add(object, options)
account.tokens.find(idOrObject, ptions)
account.tokens.findAll(options)
account.tokens.remove(idOrObject, change, options)

// to be discussed / not yet implemented
accountAdmin.sessions.findAll()
account.sessions.findAll()

accountAdmin.sessions.on('change', handler)
accountAdmin.sessions.on('add', handler)
accountAdmin.sessions.on('remove', handler)

accountAdmin.accounts.on('change', handler)
accountAdmin.accounts.on('add', handler)
accountAdmin.accounts.on('update', handler)
accountAdmin.accounts.on('remove', handler)

accountAdmin.requests.on('change', handler)
accountAdmin.requests.on('add', handler)
accountAdmin.requests.on('update', handler)
accountAdmin.requests.on('remove', handler)
```

## Constructor

```js
new AccountAdmin('https://example.com/api')
```

## admin session state

An admin can sign in using `accountAdmin.signIn(options)`. If successful, the
bearer token will be stored and used as default to authenticate all further
requests. In the browser, the bearer token and admin username is persisted in
localStorage. Where localStorage is not supported, it's stored in memory.

```js
// returns promise
accountAdmin.signIn({
  username: 'admin',
  password: 'secret'
})
// returns username of admin or undefined
accountAdmin.username
// returns true or false
accountAdmin.isSignedIn()
// username or password can be changed
accountAdmin.update(change)
// returns promise
accountAdmin.signOut()
```

## sessions

Example session Object:

```js
{
  id: 'session123',
  // account is always included
  account: {
    id: 'account456',
    username: 'pat@example.com',
    // with include: 'account.profile'
    profile: {
      id: 'account456-profile',
      fullname: 'Pat Hook'
    }
  }
}
```

### add([options])

Admins can create a session for any user. Alternatively pass `auth.username`
and `auth.password` to start a new session for the given credentials.

```js
accountAdmin.sessions.add({
  username: 'pat@example.com'
})
```

Info: Here’s how CouchDB calculates the `AuthSession` id:
https://github.com/apache/couchdb-couch/blob/master/src/couch_httpd_auth.erl#L266-L271.
It should be possible to mimic that with Node.js

### find(idOrObject[, options])

Check if a session is valid, and get its related account.
`idOrObject` is either a string or an object with an `id` property.

```js
accountAdmin.sessions.find('session123')
accountAdmin.sessions.find({
  id: 'session123'
})
```

### remove(idOrObject[, options])

`idOrObject` is either a string or an object with an `id` property.

```js
accountAdmin.sessions.remove('session123')
accountAdmin.sessions.remove({
  id: 'session123'
})
```

Info: CouchDB does not store session states, so a `DELETE /_session` request
has no effect, the sessionID remains valid. But applications may add session
states, so using the `session.remove` API is recommended.

## accounts

Example account Object:

```js
{
  id: 'account456',
  username: 'pat@example.com',
  // with include: 'profile'
  profile: {
    fullname: 'Pat Hook'
  }
}
```

### add(object[, options])

```js
accountAdmin.accounts.add({
  username: 'pat@example.com',
  password: 'secret'
})
```

### find(idOrObject[, options])

If `idOrObject` is a string, the account will be looked up by accountId. If it's
an object:

- If a `username` property is present, it will be looked up by username
- If an `id` property is present, it will be looked up by accountId
- If an `token` property is present, it will be looked up by token

```js
accountAdmin.accounts.find('account123')
accountAdmin.accounts.find({username: 'pat@example.com'})
accountAdmin.accounts.find({token: 'token123'})
```

### findAll([options])

```js
accountAdmin.accounts.findAll()
```

### update(idOrObject, change[, options])

If `idOrObject` is a string, the account will be looked up by accountId. If it's
an object:

- If a `username` property is present, it will be looked up by username
- If an `id` property is present, it will be looked up by accountId
- If an `token` property is present, it will be looked up by token

`change` can be an object of properties that you want to change, or a function
that receives the current account as argument and can manipulate it directly

```js
accountAdmin.accounts.update({token: 'token123'}, {password: 'newsecret'})
accountAdmin.accounts.update('account123', function (account) {
  account.invites--
})
```

### remove(idOrObject[, change, options])

If `idOrObject` is a string, the account will be looked up by accountId. If it's
an object:

- If a `username` property is present, it will be looked up by username
- If an `id` property is present, it will be looked up by accountId
- If an `token` property is present, it will be looked up by token

Before deletion, the account can optionally be updated, e.g. to add a reason
for the deletion. `change` can be an object of properties that you want to
change, or a function that receives the current account as argument and can
manipulate it directly

```js
accountAdmin.accounts.remove('account123')
accountAdmin.accounts.remove({
  username: 'pat@example.com'
}, {
  reason: 'support request #123'
})
```

## requests


Example request Object:

```js
{
  id: 'request123',
  type: 'passwordreset',
  contact: 'pat@example.com'
}
```

### add(object[, options])

```js
accountAdmin.requests.add({
  type: 'passwordreset',
  contact: 'pat@example.com'
})
```

### find(idOrObject[, options])

```js
accountAdmin.requests.find('token123')
accountAdmin.requests.find({id: 'token123'})
```

### findAll([options])

```js
accountAdmin.requests.findAll()
```


### remove(idOrObject[, options])

```js
accountAdmin.requests.remove('token123')
accountAdmin.requests.find({id: 'token123'})
```

## account(idOrObject)

The `.account` method returns a scoped API for one account

```js
accountAdmin.account('account123')
accountAdmin.account({id: 'account123'})
accountAdmin.account({username: 'pat@example.com'})
```

### account.profile

#### profile.find([options])

```js
account.profile.find()
```

#### profile.update(change[, options])

```js
account.profile.update({
  fullname: 'Dr. Pat Hook'
})
```

### account.tokens

#### tokens.add(object[, options])

```js
account.tokens.add({
  type: 'passwordreset',
  contact: 'pat@example.com'
})
```

### account.tokens.find(idOrObject[, options])

```js
account.tokens.find('token123')
account.tokens.find({id: 'token123'})
```

### account.tokens.findAll([options])

```js
account.tokens.findAll()
```
### account.tokens.remove(idOrObject[, options])

```js
account.tokens.remove('token123')
account.tokens.remove({id: 'token123'})
```
