const { ApolloServer } = require('apollo-server-express')
const bodyParser = require('body-parser')
const debug = require('debug')('tymly-graphql-plugin')
const express = require('express')
const helmet = require('helmet')
const typeDefs = require('./schema')

class GraphQLServerService {
  boot (options, callback) {
    const jsonLimit = process.env.TYMLY_REQUEST_SIZE_LIMIT || '10mb'

    const resolvers = require('./resolvers')(options)

    const server = new ApolloServer({ typeDefs, resolvers })
    const app = express()

    app.use(helmet())
    app.use(bodyParser.urlencoded({ extended: false, limit: jsonLimit }))
    app.use(bodyParser.json({ limit: jsonLimit }))

    options.messages.info('Created Express.js app')
    options.messages.detail(`JSON Request Size - ${jsonLimit}`)

    // Make Tymly Control available to routes
    app.set('services', options.bootedServices)

    // Allow CORS
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Custom-Header')
      next()
    })

    options.messages.info('Configured CORS')

    server.applyMiddleware({ app })

    this.app = app

    callback(null)
  }

  listen (port, cb) {
    this.server = this.app.listen({ port }, cb)
  }

  shutdown () {
    if (this.server) {
      debug('Shutting down...')
      this.server.close()
    } else {
      debug('Unable to shutdown... server not started?')
    }
  }
}

module.exports = {
  serviceClass: GraphQLServerService,
  bootAfter: ['temp', 'cards'],
  schema: require('./schema.json')
}
