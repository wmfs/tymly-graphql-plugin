/* eslint-env mocha */

const PORT = 3003
const URL = `http://localhost:${PORT}/graphql`

const path = require('path')
const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const request = require('request')
const Buffer = require('safe-buffer').Buffer

function sendToken (adminToken) {
  const options = { Accept: '*/*' }
  if (adminToken) options.authorization = 'Bearer ' + adminToken
  return options
}

describe('GraphQL tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  const secret = 'Shhh!'
  const audience = 'IAmTheAudience!'

  let tymlyService, adminToken, server

  it('create a usable admin token for Dave', () => {
    adminToken = jwt.sign({}, Buffer.from(secret, 'base64'), { subject: 'Dave', audience })
  })

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
        ],
        config: {
          auth: { secret, audience },
          defaultUsers: { Dave: 'tymlyTest_tymlyTestAdmin' }
        }
      },
      (err, services) => {
        expect(err).to.eql(null)
        tymlyService = services.tymly
        server = services.server
        done()
      }
    )
  })

  it('start GraphQL app', done => {
    server.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}.`)
      done()
    })
  })

  it('attempt to get templates', done => {
    request(
      {
        url: URL,
        method: 'POST',
        json: {
          query: '{templates}'
        }
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(200)
        done(err)
      }
    )
  })

  it('attempt to get card', done => {
    request(
      {
        url: URL,
        method: 'POST',
        json: {
          query: '{ getCard { title subtitle } }'
        }
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(200)
        expect(body.data.getCard.title).to.eql('Title') // temporary
        expect(body.data.getCard.subtitle).to.eql('Subtitle') // temporary
        done(err)
      }
    )
  })

  it('should shut down Tymly nicely', async () => {
    await tymlyService.shutdown()
  })
})
