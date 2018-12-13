# SYNOPSIS
Opinionated fetch augmented to work specifically with AWS Amplify.

# USAGE

#### CONSTRUCTOR
Extract the constructor from the required module.

```js
const Fetch = require('fetch')
```

Create an instance of the constructor, pass options.

```js
const params = {
  //
  // root is the prefix of all requests include the protocol,
  // subdomain, domain and optionally the port.
  //
  root: 'https://api.foobar.com' 
}

const fetch = new Fetch(params)
```

#### INSTANCE
Use the `request` method to invoke requests, pass the path (this will be used
to suffex the root of the request). Fetch normalizes request payloads, So don't
construct query strings, just pass a JSON object as you would for a post.

This function will find the auth info from Amplify and add it to the request
headers automatically.

```js
const params = {
  //
  // Optional, defaults to GET.
  //
  method: 'POST' 
  //
  // Optional JSON, don't stringify, the request method will handle that.
  //
  body: {},
  //
  // other params are forwarded to the underlying native fetch function.
  //
  /* ... */ 
}

fetch.request('/foo/bar/bazz', params)
```
