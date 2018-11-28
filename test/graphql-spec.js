/* eslint-env mocha */

const path = require('path')
const tymly = require('@wmfs/tymly')
const expect = require('chai').expect

describe('GraphQL tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService

  it('boot Tymly', done => {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib'),
          require.resolve('@wmfs/tymly-users-plugin'),
          require.resolve('@wmfs/tymly-rbac-plugin'),
          require.resolve('@wmfs/tymly-solr-plugin')
        ],
        blueprintPaths: [
          path.resolve(__dirname, './../test/fixtures/pizza-blueprint')
        ]
      },
      (err, services) => {
        expect(err).to.eql(null)
        tymlyService = services.tymly
        done()
      }
    )
  })

  it('should shut down Tymly nicely', async () => {
    await tymlyService.shutdown()
  })
})
