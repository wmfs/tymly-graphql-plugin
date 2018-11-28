class AuthService {
  boot (options, callback) {
    callback(null)
  }

  generateToken () {
    return ''
  }

  extractUserIdFromRequest () {}
}

module.exports = {
  serviceClass: AuthService,
  bootAfter: ['server'],
  schema: require('./schema.json')
}
