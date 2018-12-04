const { gql } = require('apollo-server-express')

module.exports = gql`
  type Query {
    templates: String
    
    getCard: Card
    
    getCards: [Card]
    
    getCardsNearby: [Card]
  }
  
  type Mutation {  
    addDoc (
      data: String
    ): Boolean
  }
  
  type Card {
    id: ID!
    docId: String
    title: String
    subtitle: String
    description: String
    latitude: Float
    longitude: Float
    eventDate: String
    search: String
    audience: String
    marking: String
    parentId: ID
  }
`
