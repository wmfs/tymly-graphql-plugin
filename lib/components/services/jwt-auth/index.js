const boom = require('boom')
const Buffer = require('safe-buffer').Buffer
const dottie = require('dottie')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const jwtMiddleware = require('express-jwt')

class AuthService {
  boot (options) {
    const secret = findSecret(options)
    const audience = findAudience(options)

    if (audience && secret) {
      const app = options.bootedServices.server.app
      this.jwtCheck = jwtMiddleware({ secret, audience })
      app.use('*', this.jwtCheck)

      this.secret = secret
      this.audience = audience

      options.messages.info('Added JWT Express middleware')
    } else {
      const error = 'Failed to set-up authentication middleware: Is $TYMLY_AUTH_SECRET/$TYMLY_AUTH_CERTIFICATE and $TYMLY_AUTH_AUDIENCE set?'
      throw boom.internal(error)
    }
  }

  generateToken (subject) {
    return jwt.sign({}, this.secret, { subject, audience: this.audience })
  }

  extractUserIdFromRequest (req) {
    return req.hasOwnProperty('user') ? req.user.sub : undefined
  }
}

function findSecret (options) {
  const secret = findCertificate(options) || findAuthSecret(options)

  if (secret === undefined) {
    options.messages.error({
      name: 'noSecret',
      message: 'No authentication secret was supplied via config or the $TYMLY_AUTH_SECRET environment variable'
    })
  }

  return secret
}

function findCertificate (options) {
  const certPath = dottie.get(options, 'config.auth.certificate') || process.env.TYMLY_CERTIFICATE_PATH

  if (certPath) options.messages.info(`Loading certificate from ${certPath}`)

  return certPath ? fs.readFileSync(certPath) : undefined
}

function findAuthSecret (options) {
  const secret = dottie.get(options, 'config.auth.secret') || process.env.TYMLY_AUTH_SECRET

  if (secret) options.messages.info(`Using auth secret`)

  return secret ? Buffer.from(secret, 'base64') : undefined
}

function findAudience (options) {
  const audience = dottie.get(options, 'config.auth.audience') || process.env.TYMLY_AUTH_AUDIENCE

  if (audience === undefined) {
    options.messages.error({
      name: 'noAudience',
      message: 'No authentication audience was supplied via config or the $TYMLY_AUTH_AUDIENCE environment variable'
    })
  } else {
    options.messages.info(`Audience ${audience}`)
  }

  return audience
}

module.exports = {
  serviceClass: AuthService,
  bootAfter: ['server'],
  schema: require('./schema.json')
}
