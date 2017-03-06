# hoodie-account-client

> Account client API for the browser

[![Build Status](https://travis-ci.org/hoodiehq/hoodie-account-client.svg?branch=master)](https://travis-ci.org/hoodiehq/hoodie-account-client)
[![Coverage Status](https://coveralls.io/repos/hoodiehq/hoodie-account-client/badge.svg?branch=master)](https://coveralls.io/github/hoodiehq/hoodie-account-client?branch=master)
[![Dependency Status](https://david-dm.org/hoodiehq/hoodie-account-client.svg)](https://david-dm.org/hoodiehq/hoodie-account-client)
[![devDependency Status](https://david-dm.org/hoodiehq/hoodie-account-client/dev-status.svg)](https://david-dm.org/hoodiehq/hoodie-account-client#info=devDependencies)

`hoodie-account-client` is a JavaScript client for the [Account JSON API](http://docs.accountjsonapi.apiary.io).
It persists session information in localStorage (or your own store API) and
provides front-end friendly APIs for things like creating a user account,
confirming, resetting a password, changing profile information, or closing the account.

## Example

```js
// Account loaded via <script> or require('@hoodie/account-client')
var account = new Account('https://example.com/account/api')

// check if user is signed in
account.get('session').then(function (session) {
  if (session) {
    renderDashboard()
  } else {
    renderWelcome()
  }
})

account.on('signout', redirectToHome)
```

## API

- [Constructor](#constructor)
- [account.validate](#accountvalidate)
- [account.signUp](#accountsignup)
- [account.signIn](#accountsignin)
- [account.signOut](#accountsignout)
- [account.destroy](#accountdestroy)
- [account.get](#accountget)
- [account.update](#accountupdate)
- [account.profile.get](#accountprofileget)
- [account.profile.fetch](#accountprofilefetch)
- [account.profile.update](#accountprofileupdate)
- [account.request](#accountrequest)
- [account.on](#accounton)
- [account.one](#accountone)
- [account.off](#accountoff)
- [Events](#events)
- [Hooks](#hooks)
- [Requests](#requests)

### Constructor

```js
new Account(options)
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
    <th align="left"><code>options.url</code></th>
    <td>String</td>
    <td>Path or full URL to root location of the account JSON API</td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>options.id</code></th>
    <td>String</td>
    <td>
      The initial account id can be passed. Useful for apps that can be used
      locally without an account.
    </td>
    <td>Defaults to random id</td>
  </tr>
  <tr>
    <th align="left"><code>options.cacheKey</code></th>
    <td>String</td>
    <td>
      Name of localStorage key where to persist the session cache. Not used
      if <code>options.cache</code> is passed.
    </td>
    <td>Defaults to <code>account</code></td>
  </tr>
  <tr>
    <th align="left"><code>options.cache</code></th>
    <td>Object</td>
    <td>
      Object with <code>.get()</code>, <code>.set(properties)</code> and
      <code>.unset()</code> methods to persist the account status. Each method
      must return a promise, <code>.get()</code> resolves with the account’s
      properties or an empty object.
    </td>
    <td>Defaults to a <a href="https://github.com/gr2m/async-get-set-store">localStorage-based API</a>, see also <code>options.cacheKey</code></td>
  </tr>
  <tr>
    <th align="left"><code>options.validate</code></th>
    <td>Function</td>
    <td>
      Optional function to validate account before sending
      sign up / sign in / update requests
    </td>
    <td>No</td>
  </tr>
</table>

Returns `account` API.

Example

```js
new Account({
  url: '/api',
  id: 'user123',
  cacheKey: 'myapp.session',
  validate: function (options) {
    if (options.username.length < 3) {
      throw new Error('Username must have at least 3 characters')
    }
  }
})
```

### account.validate

Calls the function passed into the Constructor.
Returns a Promise that resolves to `true` by default

```js
account.validate(options)
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
    <th align="left"><code>options.username</code></th>
    <td>String</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.password</code></th>
    <td>String</td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.profile</code></th>
    <td>Object</td>
    <td>No</td>
  </tr>
</table>

Resolves with an argument.

Rejects with any errors thrown by the function originally passed into the Constructor.

Example

```js
var account = new Account({
  url: '/api',
  cacheKey: 'app.session',
  validate: function (options) {
    if (options.password.length < 8) {
      throw new Error('password should contain at least 8 characters')
    }
  }
})

account.validate({
  username: 'DocsChicken',
  password: 'secret'
})

.then(function () {
  console.log('Successfully validated!')
})

.catch(function (error) {
  console.log(error) // should be an error about the password being too short
})
```

### account.signUp

Creates a new user account on the Hoodie server. Does _not_ sign in the user automatically, [account.signIn](#accountsignin) must be called separately.

```js
account.signUp(accountProperties)
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
  "updatedAt": "2016-01-01T00:00.000Z"
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>InvalidError</code></th>
    <td>Username must be set</td>
  </tr>
  <tr>
    <th align="left"><code>SessionError</code></th>
    <td>Must sign out first</td>
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
account.signUp({
  username: 'pat',
  password: 'secret'
}).then(function (accountProperties) {
  alert('Account created for ' + accountProperties.username)
}).catch(function (error) {
  alert(error)
})
```

---

🐕 **Implement account.signUp with profile: {...} option**: [#11](https://github.com/hoodiehq/hoodie-account-client/issues/11)

---

### account.signIn

Creates a user session

```js
account.signIn(options)
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

Resolves with `accountProperties`:

```json
{
  "id": "account123",
  "username": "pat",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-02T00:00.000Z",
  "profile": {
    "fullname": "Dr. Pat Hook"
  }
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnconfirmedError</code></th>
    <td>Account has not been confirmed yet</td>
  </tr>
  <tr>
    <th align="left"><code>UnauthorizedError</code></th>
    <td>Invalid Credentials</td>
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
account.signIn({
  username: 'pat',
  password: 'secret'
}).then(function (sessionProperties) {
  alert('Ohaj, ' + sessionProperties.account.username)
}).catch(function (error) {
  alert(error)
})
```

### account.signOut

Deletes the user’s session

```js
account.signOut()
```

Resolves with `sessionProperties` like [account.signin](#accountsignin),
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
    <th align="left"><code>Error</code></th>
    <td><em>A custom error thrown in a <code>before:signout</code> hook</em></td>
  </tr>
</table>

Example

```js
account.signOut().then(function (sessionProperties) {
  alert('Bye, ' + sessionProperties.account.username)
}).catch(function (error) {
  alert(error)
})
```

### account.destroy

Destroys the account of the currently signed in user.

```js
account.destroy()
```

Resolves with `sessionProperties` like [account.signin](#accountsignin),
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
    <th align="left"><code>Error</code></th>
    <td><em>A custom error thrown in a <code>before:destroy</code> hook</em></td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
account.destroy().then(function (sessionProperties) {
  alert('Bye, ' + sessionProperties.account.username)
}).catch(function (error) {
  alert(error)
})
```

### account.get

Returns account properties from local cache or fetches them from remote.
Fetches properties from remote unless

1. User is signed out
2. Only `id` and or `session` properties are requested
3. `options.local` is set to true

```js
account.get(properties, options)
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
    <th align="left"><code>properties</code></th>
    <td>String or Array of strings</td>
    <td>
      When String, only this property gets returned. If array of strings,
      only passed properties get returned
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.local</code></th>
    <td>Boolean</td>
    <td>
      When set to true then only the properties from local cache are returned.
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with object with account properties or value of passed path, depending
on the `properties` argument passed

Examples

```js
account.get().then(function (properties) {
  alert('You signed up at ' + properties.createdAt)
})
account.get('createdAt').then(function (createdAt) {
  alert('You signed up at ' + createdAt)
})
account.get(['username', 'createdAt']).then(function (properties) {
  alert('Hello ' + properties.username + '! You signed up at ' + properties.createdAt)
})
account.get({local: true}).then(function (cachedProperties) {
  // ...
})
account.get('session').then(function (session) {
  if (session) {
    // user is signed in
  } else {
    // user is signed out
  }
})
account.get('session.invalid').then(function (hasInvalidSession) {
  if (hasInvalidSession) {
    // user is signed in but has an expired or otherwise invalidated session
  }
})
```


### account.update

Update account properties on server and local cache

```js
account.update(changedProperties)
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
    <th align="left"><code>changedProperties</code></th>
    <td>Object</td>
    <td>
      Object of properties & values that changed.
      Other properties remain unchanged.
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with `accountProperties`:

```json
{
  "id": "account123",
  "username": "pat",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-01T00:00.000Z"
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
    <td><em>Custom validation error</em></td>
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
account.update({username: 'treetrunks'}).then(function (properties) {
  alert('You are now known as ' + properties.username)
})
```

### account.profile.get

Returns account properties from local cache or fetches them from remote.

```js
account.profile.get(properties)
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
    <th align="left"><code>properties</code></th>
    <td>String or Array of strings</td>
    <td>
      When String, only this property gets returned. If array of strings,
      only passed properties get returned. Property names can have `.` separators
      to return nested properties.
    </td>
    <td>No</td>
  </tr>
  <tr>
    <th align="left"><code>options.local</code></th>
    <td>Boolean</td>
    <td>
      When set to true then only the properties from local cache are returned.
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with profile properties, falls back to empty object `{}`. If a single
string is passed as `properties` then resolves with value for that property.

Examples

```js
account.profile.get().then(function (properties) {
  alert('Hey there ' + properties.fullname)
})
account.profile.get('fullname').then(function (fullname) {
  alert('Hey there ' + fullname)
})
account.profile.get(['fullname', 'address.city'], {local: true}).then(function (properties) {
  alert('Hey there ' + properties.fullname + '. How is ' + properties.address.city + '?')
})
```

### account.profile.update

Update profile properties on server and local cache

```js
account.profile.update(changedProperties)
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
    <th align="left"><code>changedProperties</code></th>
    <td>Object</td>
    <td>
      Object of properties & values that changed.
      Other properties remain unchanged.
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with `profileProperties`:

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

Rejects with:

<table>
  <tr>
    <th align="left"><code>UnauthenticatedError</code></th>
    <td>Session is invalid</td>
  </tr>
  <tr>
    <th align="left"><code>InvalidError</code></th>
    <td><em>Custom validation error</em></td>
  </tr>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
</table>

Example

```js
account.profile.update({fullname: 'Prof Pat Hook'}).then(function (properties) {
  alert('Congratulations, ' + properties.fullname)
})
```

### account.request

Sends a custom request to the server, for things like password resets,
account upgrades, etc.

```js
account.request(properties)
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
    <th align="left"><code>properties.type</code></th>
    <td>String</td>
    <td>
      Name of the request type, e.g. "passwordreset"
    </td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>properties</code></th>
    <td>Object</td>
    <td>
      Additional properties for the request
    </td>
    <td>No</td>
  </tr>
</table>

Resolves with `requestProperties`:

```json
{
  "id": "request123",
  "type": "passwordreset",
  "contact": "pat@example.com",
  "createdAt": "2016-01-01T00:00.000Z",
  "updatedAt": "2016-01-01T00:00.000Z"
}
```

Rejects with:

<table>
  <tr>
    <th align="left"><code>ConnectionError</code></th>
    <td>Could not connect to server</td>
  </tr>
  <tr>
    <th align="left"><code>NotFoundError</code></th>
    <td>Handler missing for "passwordreset"</td>
  </tr>
  <tr>
    <th align="left"><code>InvalidError</code></th>
    <td><em>Custom validation error</em></td>
  </tr>
</table>

Example

```js
account.request({type: 'passwordreset', contact: 'pat@example.com'}).then(function (properties) {
  alert('A password reset link was sent to ' + properties.contact)
})
```


### account.on

```js
account.on(event, handler)
```

Example

```js
account.on('signin', function (accountProperties) {
  alert('Hello there, ' + accountProperties.username)
})
```

### account.one

Call function once at given account event.

```js
account.one(event, handler)
```

Example

```js
account.one('signin', function (accountProperties) {
  alert('Hello there, ' + accountProperties.username)
})
```

### account.off

Removes event handler that has been added before

```js
account.off(event, handler)
```

Example

```js
account.off('singin', showNotification)
```

### Events

<table>
  <thead>
    <tr>
      <th align="left">
        Event
      </th>
      <th align="left">
        Description
      </th>
      <th align="left">
        Arguments
      </th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>signup</code></th>
    <td>New user account created successfully</td>
    <td><code>accountProperties</code> with <code>.session</code> property</td>
  </tr>
  <tr>
    <th align="left"><code>signin</code></th>
    <td>Successfully signed in to an account</td>
    <td><code>accountProperties</code> with <code>.session</code> property</td>
  </tr>
  <tr>
    <th align="left"><code>signout</code></th>
    <td>Successfully signed out</td>
    <td><code>accountProperties</code> with <code>.session</code> property</td>
  </tr>
  <tr>
    <th align="left"><code>passwordreset</code></th>
    <td>Email with password reset token sent</td>
    <td></td>
  </tr>
  <tr>
    <th align="left"><code>unauthenticate</code></th>
    <td>
      Server responded with "unauthenticated" when checking session
    </td>
    <td></td>
  </tr>
  <tr>
    <th align="left"><code>reauthenticate</code></th>
    <td>
      Successfully signed in with the same username (useful when session has expired)
    </td>
    <td><code>accountProperties</code> with <code>.session</code> property</td>
  </tr>
  <tr>
    <th align="left"><code>update</code></th>
    <td>
      Successfully updated an account's properties
    </td>
    <td><code>accountProperties</code> with <code>.session</code> property</td>
  </tr>
</table>

### Hooks

```js
// clear user’s local store signin and after signout
account.hook.before('signin', function (options) {
  return localUserStore.clear()
})
account.hook.after('signout', function (options) {
  return localUserStore.clear()
})
```

<table>
  <thead>
    <tr>
      <th align="left">
        Hook
      </th>
      <th align="left">
        Arguments
      </th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>signin</code></th>
    <td><code>options</code> as they were passed into <code>account.signIn(options)</code></td>
  </tr>
  <tr>
    <th align="left"><code>signout</code></th>
    <td><code>{}</code></td>
  </tr>
</table>

See [before-after-hook](https://www.npmjs.com/package/before-after-hook) for
more information.

### Requests

Hoodie comes with a list of built-in account requests, which can be disabled,
overwritten or extended in [hoodie-account-server](https://github.com/hoodiehq/hoodie-account-server/tree/master/plugin#optionsrequests)

When a request succeeds, an event with the same name as the request type gets
emitted. For example, `account.request({type: 'passwordreset', contact: 'pat@example.com')`
triggers a `passwordreset` event, with the `requestProperties` passed as argument.

<table>
  <tr>
    <th align="left"><code>passwordreset</code></th>
    <td>Request a password reset token</td>
  </tr>
</table>

## Testing

Local setup

```
git clone https://github.com/hoodiehq/hoodie-account-client.git
cd hoodie-account-client
npm install
```

In Node.js

Run all tests and validate JavaScript Code Style using [standard](https://www.npmjs.com/package/standard)

```
npm test
```

To run only the tests

```
npm run test:node
```

To test hoodie-account-client in a browser you can link it into [hoodie-account](https://github.com/hoodiehq/hoodie-account), which provides a dev-server:

```
git clone https://github.com/hoodiehq/hoodie-account.git
cd hoodie-account
npm install
npm link /path/to/hoodie-account-client
npm start
```

hoodie-account bundles hoodie-account-client on `npm start`, so you need to restart hoodie-account to see your changes.

## Contributing

Have a look at the Hoodie project's [contribution guidelines](https://github.com/hoodiehq/hoodie/blob/master/CONTRIBUTING.md).
If you want to hang out you can join our [Hoodie Community Chat](http://hood.ie/chat/).

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
