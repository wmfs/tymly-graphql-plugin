const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Query {
    templates: String
    
    getCard: String
    
    getCards: [String]
    
    getCardsNearby: [String]
  }
  
  type Mutation {  
    addDoc (
      data: String
    ): Boolean
  }
`

module.exports = typeDefs
