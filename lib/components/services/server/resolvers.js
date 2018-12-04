module.exports = function ({ bootedServices }) {
  const cardTemplates = bootedServices.cards.cards
  // const statebox = bootedServices.statebox

  // Temporary
  const exampleCard = {
    title: 'Title',
    subtitle: 'Subtitle'
  }

  return {
    Query: {
      templates: async (parents, args, context) => {
        /*
        const execDesc = await statebox.startExecution(
          {
            clientManifest: {
              boardNames: {},
              cardNames: {},
              categoryNames: [],
              teams: [],
              todos: [],
              formNames: {},
              startable: []
            }
          },
          'tymly_getUserRemit_1_0',
          {
            sendResponse: 'COMPLETE',
            userId: 'test'
          }
        )
        */

        return JSON.stringify(cardTemplates)
      },
      getCard: (parents, args, context) => {
        return exampleCard
      },
      getCards: async (parents, args, context) => {
        return [exampleCard]
      },
      getCardsNearby: async (parents, args, context) => {
        return [exampleCard]
      }
    },
    Mutation: {
      addDoc: (parent, args, context) => {
        return true
      }
    }
  }
}
