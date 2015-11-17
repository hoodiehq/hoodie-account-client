# hoodie-client-account

> An all things client API for the browser

[![Build Status](https://travis-ci.org/hoodiehq/hoodie-client-account.svg?branch=master)](https://travis-ci.org/hoodiehq/hoodie-client-account)
[![Coverage Status](https://coveralls.io/repos/hoodiehq/hoodie-client-account/badge.svg?branch=master)](https://coveralls.io/r/hoodiehq/hoodie-client-account?branch=master)
[![Dependency Status](https://david-dm.org/hoodiehq/hoodie-client-account.svg)](https://david-dm.org/hoodiehq/hoodie-client-account)
[![devDependency Status](https://david-dm.org/hoodiehq/hoodie-client-account/dev-status.svg)](https://david-dm.org/hoodiehq/hoodie-client-account#info=devDependencies)

`hoodie-client-account` is a JavaScript front-end client for
the [Account REST API](http://docs.accountrestapi.apiary.io).
It persists session information in localStorage and provides
front-end friendly APIs for things like creating a user account,
confirming, resetting a password, changing profile information,
or closing the account.

There is also an [admin-specific account client](admin)

## Example

```js
var account = new Account('https://example.com/account/api')

if (account.isSignedIn()) {
  renderWelcome(account)
}

account.on('signout', redirectToHome)
```

## Full API

```js
var account = new Account(options)
account.username
account.isSignedIn()

account.signUp()
account.confirm()
account.signIn()
account.signOut()
account.request()
account.get()
account.fetch()
account.update()
account.validate()

account.on('signup', handler)
account.on('signin', handler)
account.on('signout', handler)
account.on('update', handler)
account.on('reauthenticated', handler)
account.on('error:unauthenticated', handler)
account.one('signin', handleOnce)
account.off('signin', handler)
```

See more examples, options, etc at http://hoodiehq.github.io/hoodie-client-account

## Testing

In Node.js

Run all tests and validate JavaScript Code Style using [standard](https://www.npmjs.com/package/standard)

```
npm test
```

To run only the tests

```
npm run test:node
```

## Contributing

Have a look at the Hoodie project's [contribution guidelines](https://github.com/hoodiehq/hoodie/blob/master/CONTRIBUTING.md).
If you want to hang out you can join our [Hoodie Community Chat](http://hood.ie/chat/).

## License

Appache 2.0
