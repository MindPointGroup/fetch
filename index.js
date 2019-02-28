const debug = require('debug')('fetch')
const path = require('path')
const querystring = require('querystring')

const { url: root } = process.config

class Fetch {
  constructor (opts = {}) {
    this.env = opts.env || '/'
    this.root = opts.root || root
    this.auth = opts.auth
  }

  _parseArgs (opts) {
    //
    // If the body prop is supplied and the method prop is not `POST`,
    // assume that the user wants to pass the body as a querystring.
    //
    if (opts.body && opts.method !== 'POST') {
      return '?' + querystring.stringify(opts.body)
    }

    return ''
  }

  async request (url, opts = {}) {
    if (!navigator.onLine) {
      const err = new Error('No network connection detected')
      return { err }
    }

    if (opts.method) {
      //
      // Forgive the user for the verb's case.
      //
      opts.method = opts.method.toUpperCase()
    }

    //
    //
    //
    if (opts.body && opts.method === 'POST') {
      opts.body = JSON.stringify(opts.body)
    }

    const session = await this.auth.currentSession()

    const request = {
      response: true,
      body: opts && opts.body,
      method: opts.method || 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.idToken.jwtToken
      }
    }

    if (opts.headers) {
      request.headers = Object.assign({}, request.headers, opts.headers)
    }

    const pathname = this.root + path.join(this.env, url)
    let p = pathname + this._parseArgs(opts)

    if (opts.body && opts.method !== 'POST') {
      delete request.body
    }

    debug('PATH', p)
    debug('REQUEST', request)

    let res = null

    try {
      res = await window.fetch(p, request)
    } catch (err) {
      return { err, res: {} }
    }

    res.statusCode = res.status

    let data

    try {
      data = await res.json()
      //
      // in the case where we have aws integration boilerplate
      // we can omit it since we also have it on the response.
      //
      if (data.body && data.statusCode) {
        try {
          data = JSON.parse(data.body)
        } catch (err) {
          data = data.body
        }
      }
      debug('RESPONSE DATA', data)
    } catch (err) {
      return { err, res: {} }
    }

    if (!res.ok || res.statusCode >= 300 || res.statusCode < 200) {
      const err = new Error(res.statusText || res.message)
      return { err, res, data }
    }

    return { res, data }
  }
}

module.exports = Fetch
