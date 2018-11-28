class StateboxApiService {
  boot (options, callback) {
    callback(null)
  }
}

module.exports = {
  serviceClass: StateboxApiService,
  bootAfter: ['temp'],
  schema: require('./schema.json')
}
