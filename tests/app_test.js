const chai = require('chai')
const chaiHttp = require('chai-http')
const nock = require('nock')
const app = require('../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('gram', () => {
  describe('GET /', () => {
    it('returns a "hello world" message', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.message).to.equal('hello world')
          done()
        })
    })
  })

  describe('GET /recent-media', () => {
    describe('when no IG_ACCESS_TOKEN env variable is set', () => {
      it('returns a status of 500 with a helpful message', (done) => {
        chai.request(app)
          .get('/recent-media')
          .end((err, res) => {
            expect(res.status).to.equal(500)
            expect(res.body.message).to.equal('Required IG_ACCESS_TOKEN environment variable not set')
            done()
          })
      })
    })

    describe('when an IG_ACCESS_TOKEN env variable is set', () => {
      beforeEach(() => {
        process.env.IG_ACCESS_TOKEN = '123'
      })

      afterEach(() => {
        process.env.IG_ACCESS_TOKEN = ''
      })

      describe('when the app encounters a problem issuing a request against the IG API', () => {
        beforeEach(() => {
          nock('https://api.instagram.com')
            .get('/v1/users/self/media/recent?access_token\=123&count=8')
            .reply(500)
        })

        it('returns the recent media from the correct Instagram API endpoint', (done) => {
          chai.request(app)
            .get('/recent-media')
            .end((err, res) => {
              expect(res.body.message).to.equal('Request failed with status code 500')
              done()
            })
        })
      })

      describe('when the app does not encounter a problem issuing a request against the IG API', () => {
        beforeEach(() => {
          nock('https://api.instagram.com')
            .get('/v1/users/self/media/recent?access_token\=123&count=8')
            .reply(200, {
              data: [{
                caption: 'some caption'
              }]
            })
        })


        it('returns the recent media from the correct Instagram API endpoint', (done) => {
          chai.request(app)
            .get('/recent-media')
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body[0].caption).to.equal('some caption')
              done()
            })
        })

        describe('the CORS headers present in its response', (done) => {
          it('sets the proper access-control-allow-origin', (done) => {
            chai.request(app)
              .options('/recent-media')
              .end((err, res) => {
                expect(res.headers['access-control-allow-origin']).to.equal('*')
                done()
              })
          })

          it('sets the proper access-control-allow-methods', (done) => {
            chai.request(app)
              .options('/recent-media')
              .end((err, res) => {
                expect(res.headers['access-control-allow-methods']).to.equal('GET,HEAD,PUT,PATCH,POST,DELETE')
                done()
              })
          })
        })
      })
    })
  })
})
