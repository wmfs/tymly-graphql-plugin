module.exports = function (options) {
  const cardTemplates = options.bootedServices.cards.cards

  // Temporary
  const exampleCard = {
    title: 'Title',
    subtitle: 'Subtitle'
  }

  return {
    Query: {
      templates: async (parents, args, context) => {
        return JSON.stringify(cardTemplates)
      },
        getCard: (parents, args, context) => {
        return exampleCard
      },
        getCards: async (parents, args, context) => {
        return [ exampleCard ]
      },
        getCardsNearby: async (parents, args, context) => {
        return [ exampleCard ]
      }
    },
    Mutation: {
      addDoc: (parent, args, context) => {
        return true
      }
    }
  }
}
