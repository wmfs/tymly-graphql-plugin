const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')

class GraphQLServerService {
  boot (options, callback) {
    const cardTemplates = options.bootedServices.cards.cards

    const resolvers = {
      Query: {
        templates: async (parents, args, context) => {
          return JSON.stringify(cardTemplates)
        },
        getCard: (parents, args, context) => {
          return 'card'
        },
        getCards: async (parents, args, context) => {
          return ['card', 'card']
        },
        getCardsNearby: async (parents, args, context) => {
          return ['card', 'card']
        }
      },
      Mutation: {
        addDoc: (parent, args, context) => {
          return true
        }
      }
    }

    this.server = new ApolloServer({ typeDefs, resolvers })

    /*
    this.server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
      callback(null)
    })
    */

    callback(null)
  }

  listen (port, cb) {
    this.server.listen(port).then(cb)
  }

  shutdown () {}
}

module.exports = {
  serviceClass: GraphQLServerService,
  bootAfter: ['temp', 'cards'],
  schema: require('./schema.json')
}
