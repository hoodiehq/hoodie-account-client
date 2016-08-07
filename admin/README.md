[back to hoodie-account-client](../README.md)

# @hoodie/account-client/admin

`@hoodie/account-client/admin` is a JavaScript front-end client for
the admin routes of the [Account JSON API](http://docs.accountjsonapi.apiary.io).

It persists the admin’s session information in localStorage and provides
front-end friendly APIs for things like managing users, sessions, profiles
and requests.

The account admin client is a front-end API that wraps all
admin-specific RESTful APIs following the [account JSON API](http://docs.accountjsonapi.apiary.io/)
specifications.

## Example

```js
// Account loaded via <script> or require('@hoodie/account-client/admin')
var admin = new AccountAdmin({url: 'https://example.com/account/api'})

if (!account.isSignedIn()) {
  renderLogin()
} else {
  admin.accounts.findAll().then(renderAccounts)
}

admin.accounts.on('change', renderAccounts)
```

## API

- [Constructor](#constructor)
- [admin.username](#adminusername)
- [admin.signin()](#adminsignin)
- [admin.signout()](#adminsignout)
- [admin.sessions.add()](#adminsessionsadd)
- [admin.sessions.find()](#adminsessionsfind)
- [admin.sessions.findAll()](#adminsessionsfindall)
- [admin.sessions.remove()](#adminsessionsremove)
- [admin.sessions.removeAll()](#adminsessionsremoveall)
- [admin.accounts.add()](#adminaccountsadd)
- [admin.accounts.find()](#adminaccountsfind)
- [admin.accounts.findAll()](#adminaccountsfindall)
- [admin.accounts.update()](#adminaccountsupdate)
- [admin.accounts.updateAll()](#adminaccountsupdateall)
- [admin.accounts.remove()](#adminaccountsremove)
- [admin.accounts.removeAll()](#adminaccountsremoveall)
- [admin.requests.add()](#adminrequestsadd)
- [admin.requests.find()](#adminrequestsfind)
- [admin.requests.findAll()](#adminrequestsfindall)
- [admin.requests.remove()](#adminrequestsremove)
- [admin.requests.removeAll()](#adminrequestsremoveall)
- [admin.account()](#adminaccount)
- [admin.account().profile.find()](#adminaccountprofilefind)
- [admin.account().profile.update()](#adminaccountprofileupdate)
- [admin.account().tokens.add()](#adminaccounttokensadd)
- [admin.account().tokens.find()](#adminaccounttokensfind)
- [admin.account().tokens.findAll()](#adminaccounttokensfindall)
- [admin.account().tokens.remove()](#adminaccounttokensremove)
- [admin.account().roles.add()](#adminaccountrolesadd)
- [admin.account().roles.findAll()](#adminaccountrolesfindall)
- [admin.account().roles.remove()](#adminaccountrolesremove)
- [Events](#events)

### Constructor

```js
new AccountAdmin({
  // required. Path or full URL to root location of the account JSON API
  url: '/api',
  // name of localStorage key where to persist the session state.
  // Defaults to "account_admin"
  cacheKey: 'myapp.admin.session'
})
```

### admin.username

_Read-only_. Returns the username if signed in, otherwise `undefined`.


### admin.isSignedIn()

Returns `true` if user is currently signed in, otherwise `false`.

```js
admin.isSignedIn()
```

### admin.signIn

Creates a user session. If successful, the session id will be stored
and used as default to authenticate all further requests. In the browser, the
session id and admin username is persisted in localStorage. Where localStorage
is not supported, it’s stored in memory.

```js
admin.signIn(options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>options.username</code></th>
    <td>String</td>
    <td>-</td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>options.password</code></th>
    <td>String</td>
    <td>-</td>
    <td>Yes</td>
  </tr>
</table>

Resolves with `sessionProperties`:

```json
{
  "id": "session123",
  "account": {
    "id": "account123",
    "username": "pat",
    "createdAt": "2016-01-01T00:00.000Z",
    "updatedAt": "2016-01-02T00:00.000Z",
    "profile": {
      "fullname": "Dr. Pat Hook"
    }
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>UnconfirmedError</code></th>
    <td>Account has not been confirmed yet</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Account could not be found</td>
  </tr>
  <tr>
    <th align="left"><code>Error</code></th>
    <td><em>A custom error set on the account object, e.g. the account could be blocked due to missing payments</em></td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.signIn({
  username: 'pat',
  password: 'secret'
}).then(function (sessionProperties) {
  alert('Ohaj, ' + sessionProperties.account.username)
}).catch(function (error) {
  alert(error)
})
```

### admin.signOut

Deletes the user’s session

```js
admin.signOut()
```

Resolves with `sessionProperties` like [admin.signin](#accountsignin),
but without the session id:

```json
{
  "account": {
    "id": "account123",
    "username": "pat",
    "createdAt": "2016-01-01T00:00.000Z",
    "updatedAt": "2016-01-02T00:00.000Z",
    "profile": {
      "fullname": "Dr. Pat Hook"
    }
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Not signed in</td>
  </tr>
  <tr>
    <th align="left"><code>Error</code></th>
    <td><em>A custom error thrown in a <code>before:signout</code> hook</em></td>
  </tr>
</table>

Example

```js
admin.signOut().then(function (sessionProperties) {
  alert('Bye, ' + sessionProperties.account.username)
}).catch(function (error) {
  alert(error)
})
```

### admin.sessions.add()

---

---

Admins can create a session for any user.

```js
admin.sessions.add(options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>options.username</code></th>
    <td>String</td>
    <td>-</td>
    <td>Yes</td>
  </tr>
</table>

Resolves with `sessionProperties`

```js
{
  id: 'Session123',
  // account is always included
  account: {
    id: 'account456',
    username: 'pat@example.com'
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Account could not be found</td>
  </tr>
  <tr>
    <th align="left"><code>Error</code></th>
    <td><em>A custom error set on the account object, e.g. the account could be blocked due to missing payments</em></td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.sessions.add({
  username: 'pat'
}).then(function (sessionProperties) {
  var sessionId = sessionProperties.id
  var username = sessionProperties.account.username
}).catch(function (error) {
  console.error(error)
})
```

### admin.sessions.find()

---

🐕 **TO BE DONE**: [#19](https://github.com/hoodiehq/hoodie-account-client/issues/19)

---

```js
admin.sessions.find(sessionId)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>sessionId</code></th>
    <td>String</td>
    <td>-</td>
    <td>Yes</td>
  </tr>
</table>

Resolves with `sessionProperties`

```js
{
  id: 'Session123',
  // account is always included
  account: {
    id: 'account456',
    username: 'pat@example.com'
    // admin accounts have no profile
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Session could not be found</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.sessions.find('abc4567').then(function (sessionProperties) {
  alert('Session is valid.')
}).catch(function (error) {
  if (error.name === 'NotFoundError') {
    alert('Session is invalid')
    return
  }

  console.error(error)
})
```


### admin.sessions.findAll()

---

🐕 **TO BE DONE**: [#19](https://github.com/hoodiehq/hoodie-account-client/issues/19)

---

```js
admin.sessions.findAll(options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>options.include</code></th>
    <td>String</td>
    <td>
      If set to <code>"account.profile"</code>, the <code>profile: {...}</code>
      property will be added to the response.
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.sort</code></th>
    <td>String or String[]</td>
    <td>
      string of comma-separated list of attributes to sort by, or array of strings, see
      <a href="http://jsonapi.org/format/#fetching-sorting">JSON API: Sorting</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.fields</code></th>
    <td>Object</td>
    <td>
      Map of fields to include in response by type, see
      <a href="http://jsonapi.org/format/#fetching-sparse-fieldsets">JSON API: Sparse Fieldset</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.page.offset</code></th>
    <td>Number</td>
    <td>
      see <a href="http://jsonapi.org/format/#fetching-pagination">JSON API: Pagination</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.page.limit</code></th>
    <td>Number</td>
    <td>
      see <a href="http://jsonapi.org/format/#fetching-pagination">JSON API: Pagination</a>
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with Array of `sessionProperties`

```js
[{
  id: 'Session123',
  account: {
    id: 'account456',
    username: 'pat@example.com'
  }
}, {
  id: 'Session456',
  account: {
    id: 'account789',
    username: 'sam@example.com'
  }
}]
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.sessions.findAll()
  .then(renderSessions)
  .catch(function (error) {
    console.error(error)
  })
```

### admin.sessions.remove()

---

🐕 **TO BE DONE**: [#19](https://github.com/hoodiehq/hoodie-account-client/issues/19)

---

```js
admin.sessions.remove(sessionId)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>sessionId</code></th>
    <td>String</td>
    <td>-</td>
    <td>Yes</td>
  </tr>
</table>

Resolves with `sessionProperties`

```js
{
  id: 'Session123',
  account: {
    id: 'account456',
    username: 'pat@example.com'
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Session could not be found</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.sessions.remove('abc4567').then(function (sessionProperties) {
  alert('Session invalidated')
}).catch(function (error) {
  console.error(error)
})
```

### admin.sessions.removeAll()

---

🐕 **TO BE DONE**: [#19](https://github.com/hoodiehq/hoodie-account-client/issues/19)

---

```js
admin.sessions.removeAll(options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>options.sort</code></th>
    <td>String or String[]</td>
    <td>
      string of comma-separated list of attributes to sort by, or array of strings, see
      <a href="http://jsonapi.org/format/#fetching-sorting">JSON API: Sorting</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.fields</code></th>
    <td>Object</td>
    <td>
      Map of fields to include in response by type, see
      <a href="http://jsonapi.org/format/#fetching-sparse-fieldsets">JSON API: Sparse Fieldset</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.page.offset</code></th>
    <td>Number</td>
    <td>
      see <a href="http://jsonapi.org/format/#fetching-pagination">JSON API: Pagination</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.page.limit</code></th>
    <td>Number</td>
    <td>
      see <a href="http://jsonapi.org/format/#fetching-pagination">JSON API: Pagination</a>
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with Array of `sessionProperties`

```js
[{
  id: 'Session123',
  account: {
    id: 'account456',
    username: 'pat@example.com'
  }
}, {
  id: 'Session456',
  account: {
    id: 'account789',
    username: 'sam@example.com'
  }
}]
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.sessions.removeAll().then(function (sessionProperties) {
  alert('All Sessions invalidated.')
}).catch(function (error) {
  if (error.name === 'NotFoundError') {
    alert('Session is invalid')
    return
  }

  console.error(error)
})
```

### admin.accounts.add()

```js
admin.accounts.add(object)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>accountProperties.username</code></th>
    <td>String</td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>accountProperties.password</code></th>
    <td>String</td>
    <td>Yes</td>
  </tr>
</table>

Resolves with `accountProperties`:

```json
{
  "id": "account123",
  "username": "pat",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-01T00:00.000Z",
  "profile": {
    "fullname": "Dr. Pat Hook"
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>InvalidError</code></th>
    <td>Username must be set</td>
  </tr>
  <tr>
    <th align="left"><code>ConflictError</code></th>
    <td>Username <strong>&lt;username&gt;</strong> already exists</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.accounts.add({
  username: 'pat',
  password: 'secret',
  profile: {
    fullname: 'Dr Pat Hook'
  }
}).then(function (accountProperties) {
  alert('Account created for ' + accountProperties.username)
}).catch(function (error) {
  alert(error)
})
```


### admin.accounts.find()

An account can be looked up by account.id, username or token.

- If a `username` property is present, it will be looked up by username
- If an `id` property is present, it will be looked up by accountId
- If an `token` property is present, it will be looked up by token

```js
admin.accounts.find(idOrObject, options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>idOrObject</code></th>
    <td>String</td>
    <td>account ID. Same as <code>{id: accountId}</code></td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.id</code></th>
    <td>String</td>
    <td>account ID. Same as passing <code>accountId</code> as string</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.username</code></th>
    <td>String</td>
    <td>Lookup account by username</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.token</code></th>
    <td>String</td>
    <td>Lookup account by one-time token</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.include</code></th>
    <td>String</td>
    <td>
      If set to <code>"profile"</code>, the <code>profile: {...}</code>
      property will be added to the response
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with `accountProperties`:

```js
{
  "id": "account123",
  "username": "pat",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-01T00:00.000Z",
  // if options.include === 'profile'
  "profile": {
    "fullname": "Dr. Pat Hook"
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Account not found</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.accounts.find({ username: 'pat' })
  .then(renderAccount)
  .catch(function (error) {
    alert(error)
  })
```



### admin.accounts.findAll()

```js
admin.accounts.findAll(options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>options.include</code></th>
    <td>String</td>
    <td>
      If set to <code>"profile"</code>, the <code>profile: {...}</code>
      property will be added to the response.
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.sort</code></th>
    <td>String or String[]</td>
    <td>
      string of comma-separated list of attributes to sort by, or array of strings, see
      <a href="http://jsonapi.org/format/#fetching-sorting">JSON API: Sorting</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.fields</code></th>
    <td>Object</td>
    <td>
      Map of fields to include in response by type, see
      <a href="http://jsonapi.org/format/#fetching-sparse-fieldsets">JSON API: Sparse Fieldset</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.page.offset</code></th>
    <td>Number</td>
    <td>
      see <a href="http://jsonapi.org/format/#fetching-pagination">JSON API: Pagination</a>
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.page.limit</code></th>
    <td>Number</td>
    <td>
      see <a href="http://jsonapi.org/format/#fetching-pagination">JSON API: Pagination</a>
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with Array of `accountProperties`

```js
[{
  "id": "account123",
  "username": "pat",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-01T00:00.000Z",
  // if options.include === 'profile'
  "profile": {
    "fullname": "Dr. Pat Hook"
  }
}, {
  "id": "account456",
  "username": "sam",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-01T00:00.000Z",
  // if options.include === 'profile'
  "profile": {
    "fullname": "Lady Samident"
  }
}]
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
admin.accounts.findAll()
  .then(renderAccounts)
  .catch(function (error) {
    console.error(error)
  })
```

### admin.accounts.update()

An account can be looked up by account.id, username or token.

- If a `username` property is present, it will be looked up by username
- If an `id` property is present, it will be looked up by accountId
- If an `token` property is present, it will be looked up by token

```js
admin.accounts.update(idOrObject, changedProperties, options)
// or
admin.accounts.update(accountProperties, options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>idOrObject</code></th>
    <td>String</td>
    <td>account ID. Same as <code>{id: accountId}</code></td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.id</code></th>
    <td>String</td>
    <td>account ID. Same as passing <code>accountId</code> as string</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.username</code></th>
    <td>String</td>
    <td>Lookup account by username</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.token</code></th>
    <td>String</td>
    <td>Lookup account by one-time token</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>changedProperties</code></th>
    <td>Object</td>
    <td>
      Object of properties & values that changed.
      Other properties remain unchanged.
    </td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>accountProperties</code></th>
    <td>Object</td>
    <td>
      Must have an <code>id</code> or a <code>username</code> property.
      The user’s account will be updated with the passed properties. Existing
      properties not passed remain unchanged.
    </td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>options.include</code></th>
    <td>String</td>
    <td>
      If set to <code>"profile"</code>, the <code>profile: {...}</code>
      property will be added to the response. Defaults to <code>"profile"</code>
      if <code>accountProperties.profile</code> or <code>changedProperties.profile</code>
      is set.
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with `accountProperties`:

```js
{
  "id": "account123",
  "username": "pat",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-01T00:00.000Z",
  // if options.include === 'profile'
  "profile": {
    "fullname": "Dr. Pat Hook"
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Account not found</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Examples

```js
admin.accounts.update({ username: 'pat' }, { foo: 'bar' })
  .then(renderAccount)
  .catch(function (error) {
    alert(error)
  })
// same as
admin.accounts.update({ username: 'pat', foo: 'bar' })
  .then(renderAccount)
  .catch(function (error) {
    alert(error)
  })
```

### admin.accounts.updateAll()

---

🐕 **TO BE DONE**: [#30](https://github.com/hoodiehq/hoodie-account-client/issues/30)

---

### admin.accounts.remove()

An account can be looked up by account.id, username or token.

- If a `username` property is present, it will be looked up by username
- If an `id` property is present, it will be looked up by accountId
- If an `token` property is present, it will be looked up by token

```js
admin.accounts.remove(idOrObject, changedProperties, options)
// or
admin.accounts.remove(accountProperties, options)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>idOrObject</code></th>
    <td>String</td>
    <td>account ID. Same as <code>{id: accountId}</code></td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.id</code></th>
    <td>String</td>
    <td>account ID. Same as passing <code>accountId</code> as string</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.username</code></th>
    <td>String</td>
    <td>Lookup account by username</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>idOrObject.token</code></th>
    <td>String</td>
    <td>Lookup account by one-time token</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>changedProperties</code></th>
    <td>Object</td>
    <td>
      Object of properties & values that changed.
      Other properties remain unchanged.
    </td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>accountProperties</code></th>
    <td>Object</td>
    <td>
      Must have an <code>id</code> or a <code>username</code> property.
      The user’s account will be updated with the passed properties. Existing
      properties not passed remain unchanged. Note that
      <code>accountProperties.token</code> is not allowed, as it’s not a valid
      account property, but an option to look up an account. An account can
      have multiple tokens at once.
    </td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>options.include</code></th>
    <td>String</td>
    <td>
      If set to <code>"profile"</code>, the <code>profile: {...}</code>
      property will be added to the response. Defaults to <code>"profile"</code>
      if <code>accountProperties.profile</code> or <code>changedProperties.profile</code>
      is set.
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with `accountProperties`:

```js
{
  "id": "account123",
  "username": "pat",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-02-01T00:00.000Z",
  "deletedAt": "2016-03-01T00:00.000Z",
  // if options.include === 'profile'
  "profile": {
    "fullname": "Dr. Pat Hook"
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Account not found</td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Examples

```js
admin.accounts.remove({ username: 'pat' }, { reason: 'foo bar' })
  .then(redirectToHome)
  .catch(function (error) {
    alert(error)
  })
// same as
admin.accounts.remove({ username: 'pat', reason: 'foo bar' })
  .then(redirectToHome)
  .catch(function (error) {
    alert(error)
  })
```

### admin.accounts.removeAll()

---

🐕 **TO BE DONE**: [#31](https://github.com/hoodiehq/hoodie-account-client/issues/31)

---

### admin.requests.add()

---

🐕 **TO BE DONE**: [#8](https://github.com/hoodiehq/hoodie-account-client/issues/8)

---

```js
admin.requests.add({
  type: 'passwordreset',
  contact: 'pat@example.com'
})
```

Resolves with

```js
{
  id: 'request123',
  type: 'passwordreset',
  contact: 'pat@example.com'
}
```

### admin.requests.find()

---

🐕 **TO BE DONE**: [#8](https://github.com/hoodiehq/hoodie-account-client/issues/8)

---

```js
admin.requests.find('token123')
admin.requests.find({id: 'token123'})
```

### admin.requests.findAll()

---

🐕 **TO BE DONE**: [#8](https://github.com/hoodiehq/hoodie-account-client/issues/8)

---

```js
admin.requests.findAll()
```

### admin.requests.remove()

---

🐕 **TO BE DONE**: [#8](https://github.com/hoodiehq/hoodie-account-client/issues/8)

---

```js
admin.requests.remove('token123')
admin.requests.find({id: 'token123'})
```

### admin.requests.removeAll()

---

🐕 **TO BE DONE**: [#8](https://github.com/hoodiehq/hoodie-account-client/issues/8)

---



### admin.account()

The `admin.account` method returns a scoped API for one account

```js
var account = admin.account(idOrObject)
```

Examples

```js
admin.account('account123')
admin.account({id: 'account123'})
admin.account({username: 'pat@example.com'})
admin.account({token: 'pat@example.com'})
```

### admin.account().profile.find()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).profile.find()
```

resolves with `profileProperties`

```json
{
  "id": "account123-profile",
  "fullname": "Dr Pat Hook",
  "address": {
    "city": "Berlin",
    "street": "Adalberststraße 4a"
  }
}
```


### admin.account().profile.update()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).profile.update(changedProperties)
```

resolves with `profileProperties`

```json
{
  "id": "account123-profile",
  "fullname": "Dr Pat Hook",
  "address": {
    "city": "Berlin",
    "street": "Adalberststraße 4a"
  }
}
```


### admin.account().tokens.add()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).tokens.add(properties)
```

resolves with `tokenProperties`

```json
{
  "id": "token123",
  "type": "passwordreset",
  "accountId": "account123",
  "contact": "pat@example.com",
  "createdAt": "2016-01-01T00:00.000Z"
}
```

Example

```js
admin.account('token123').account.tokens.add({
  type: 'passwordreset',
  contact: 'pat@example.com'
})
```

### admin.account().tokens.find()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).tokens.find(idOrObject)
```

resolves with `tokenProperties`

```json
{
  "id": "token123",
  "type": "passwordreset",
  "accountId": "account123",
  "contact": "pat@example.com",
  "createdAt": "2016-01-01T00:00.000Z"
}
```

Example

```js
admin.account({username: 'pat'}).tokens.find('token123')
```


### admin.account().tokens.findAll()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).tokens.findAll(options)
```

resolves with array of `tokenProperties`

```json
[{
  "id": "token123",
  "type": "passwordreset",
  "accountId": "account123",
  "contact": "pat@example.com",
  "createdAt": "2016-01-01T00:00.000Z"
}, {
  "id": "token456",
  "type": "session",
  "accountId": "account123",
  "createdAt": "2016-01-02T00:00.000Z"
}]
```

Example

```js
admin.account({username: 'pat'}).tokens.findAll()
  .then(renderTokens)
  .catch(function (error) {
    alert(error)
  })
```


### admin.account().tokens.remove()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).tokens.remove(idOrObject)
```

resolves with `tokenProperties`

```json
{
  "id": "token123",
  "type": "passwordreset",
  "accountId": "account123",
  "contact": "pat@example.com",
  "createdAt": "2016-01-01T00:00.000Z"
}
```

Example

```js
admin.account({username: 'pat'}).tokens.removes('token123')
```


### admin.account().roles.add()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).roles.add(name)
```

resolves with `roleName`

```json
"mycustomrole"
```

Example

```js
admin.account({username: 'pat'}).roles.add('mycustomrole')
```


### admin.account().roles.findAll()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).roles.add(name)
```

resolves with array of `roleName`s

```json
["mycustomrole", "myothercustomrole"]
```

Example

```js
admin.account({username: 'pat'}).roles.findAll()
  .then(renderRoles)
  .catch(function (error) {
    alert(error)
  })
```


### admin.account().roles.remove()

---

🐕 **TO BE DONE**: [#20](https://github.com/hoodiehq/hoodie-account-client/issues/20)

---

```js
admin.account(idOrObject).roles.remove(name)
```

resolves with `roleName`

```json
"mycustomrole"
```

Example

```js
admin.account({username: 'pat'}).roles.remove('mycustomrole')
```

### Events

---

🐕 **WORK IN PROGRESS**: [#21](https://github.com/hoodiehq/hoodie-account-client/issues/21)

---

Events emitted on `admin`

<table>
  <tr>
    <th align="left"><code>signin</code></th>
    <td>Successfully signed in to an account</td>
  </tr>
  <tr>
    <th align="left"><code>signout</code></th>
    <td>Successfully signed out</td>
  </tr>
  <tr>
    <th align="left"><code>unauthenticate</code></th>
    <td>Server responded with "unauthenticated" when checking session</td>
  </tr>
  <tr>
    <th align="left"><code>reauthenticate</code></th>
    <td>Successfully signed in after "unauthenticated" state</td>
  </tr>
</table>

Example

```js
admin.on('signin', showApp)
admin.on('signout', showLogin)
```

Events emitted on

- `admin.sessions`
- `admin.accounts`
- `admin.requests`

<table>
  <tr>
    <th align="left"><code>change</code></th>
    <td>
      triggered for any <code>add</code>, <code>update</code> and <code>remove</code> event
    </td>
  </tr>
  <tr>
    <th align="left" colspan="2"><code>add</code></th>
  </tr>
  <tr>
    <th align="left" colspan="2"><code>update</code></th>
  </tr>
  <tr>
    <th align="left" colspan="2"><code>remove</code></th>
  </tr>
</table>

```js
admin.sessions.on('change', function (eventName, session) {})
admin.accounts.on('update', function (account) {})
admin.requests.on('remove', handler)
```
