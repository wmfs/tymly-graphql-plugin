/* eslint-env mocha */

const PORT = 3003
const URL = `http://localhost:${PORT}/graphql`

const path = require('path')
const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const request = require('request')
const jwt = require('jsonwebtoken')
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
  const subject = 'Dave'

  let tymlyService, server, adminToken

  it(`create a usable admin token for ${subject}`, () => {
    adminToken = jwt.sign({}, Buffer.from(secret, 'base64'), { subject, audience })
  })

  it('boot Tymly without auth config', done => {
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
        expect(err.message).to.eql('Failed to set-up authentication middleware: Is $TYMLY_AUTH_SECRET/$TYMLY_AUTH_CERTIFICATE and $TYMLY_AUTH_AUDIENCE set?')
        done()
      }
    )
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
          auth: { secret, audience }
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

  it('attempt to get templates without token', done => {
    request(
      {
        url: URL,
        method: 'POST',
        json: {
          query: '{templates}'
        }
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(401)
        done(err)
      }
    )
  })

  it('attempt to get templates with token', done => {
    request(
      {
        url: URL,
        method: 'POST',
        json: {
          query: '{templates}'
        },
        headers: sendToken(adminToken)
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(200)

        const templates = JSON.parse(body.data.templates)

        expect(Object.keys(templates)).to.eql(['pizza_orderPizza'])
        expect(templates['pizza_orderPizza'].title).to.eql('Pizza Place')

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
        },
        headers: sendToken(adminToken)
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(200)

        // temporary
        expect(body.data.getCard.title).to.eql('Title')
        expect(body.data.getCard.subtitle).to.eql('Subtitle')

        done(err)
      }
    )
  })

  it('attempt to get cards', done => {
    request(
      {
        url: URL,
        method: 'POST',
        json: {
          query: '{ getCards { title subtitle } }'
        },
        headers: sendToken(adminToken)
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(200)

        // temporary
        expect(body.data.getCards[0].title).to.eql('Title')
        expect(body.data.getCards[0].subtitle).to.eql('Subtitle')

        done(err)
      }
    )
  })

  it('attempt to get cards nearby', done => {
    request(
      {
        url: URL,
        method: 'POST',
        json: {
          query: '{ getCardsNearby { title subtitle } }'
        },
        headers: sendToken(adminToken)
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(200)

        // temporary
        expect(body.data.getCardsNearby[0].title).to.eql('Title')
        expect(body.data.getCardsNearby[0].subtitle).to.eql('Subtitle')

        done(err)
      }
    )
  })

  it('attempt to add doc', done => {
    request(
      {
        url: URL,
        method: 'POST',
        json: {
          query: 'mutation { addDoc }'
        },
        headers: sendToken(adminToken)
      },
      (err, res, body) => {
        expect(res.statusCode).to.equal(200)

        // temporary
        expect(body.data.addDoc).to.eql(true)

        done(err)
      }
    )
  })

  it('should shut down Tymly nicely', async () => {
    await tymlyService.shutdown()
  })
})
