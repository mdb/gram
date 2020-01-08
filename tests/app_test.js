const chai = require('chai')
const chaiHttp = require('chai-http')
const nock = require('nock')
const app = require('../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('gram', () => {
  describe('GET /', () => {
    beforeEach((done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          this.err = err
          this.res = res

          done()
        })
    })

    it('does not return an error', () => {
      expect(this.err).to.be.null
    })

    it('returns a 200 status code', () => {
      expect(this.res.status).to.equal(200)
    })

    it('returns a "hello world" message', () => {
      expect(this.res.body.message).to.equal('hello world')
    })
  })

  describe('GET /recent-media', () => {
    describe('when no IG_ACCESS_TOKEN env variable is set', () => {
      beforeEach((done) => {
        chai.request(app)
          .get('/recent-media')
          .end((err, res) => {
            this.err = err
            this.res = res

            done()
          })
      })

      it('does not return an error', () => {
        expect(this.err).to.be.null
      })

      it('returns a status of 500', () => {
        expect(this.res.status).to.equal(500)
      })

      it('returns a helpful message', () => {
        expect(this.res.body.message).to.equal('Required IG_ACCESS_TOKEN environment variable not set')
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
        beforeEach((done) => {
          nock('https://api.instagram.com')
            .get('/v1/users/self/media/recent?access_token\=123&count=8')
            .reply(400)

          chai.request(app)
            .get('/recent-media')
            .end((err, res) => {
              this.res = res
              this.err = err

              done()
            })
        })

        it('does not return an error', () => {
          expect(this.err).to.be.null
        })

        it('surfaces the upstream status code', () => {
          expect(this.res.status).to.equal(400)
        })

        it('surfaces a helpful message about the upstream error', () => {
          expect(this.res.body.message).to.equal('Request failed with status code 400')
        })
      })

      describe('when the app does not encounter a problem issuing a request against the IG API', () => {
        beforeEach((done) => {
          nock('https://api.instagram.com')
            .get('/v1/users/self/media/recent?access_token\=123&count=8')
            .reply(200, {
              data: [{
                caption: {
                  text: 'some caption'
                }
              }]
            })

          chai.request(app)
            .get('/recent-media')
            .end((err, res) => {
              this.err = err
              this.res = res

              done()
            })
        })

        it('does not return an error', () => {
          expect(this.err).to.be.null
        })

        it('returns a 200 status code', () => {
          expect(this.res.status).to.equal(200)
        })

        it('returns the recent media from the correct Instagram API endpoint', () => {
          expect(this.res.body[0].caption.text).to.equal('some caption')
        })

        describe('the CORS headers present in its response', () => {
          it('sets the proper access-control-allow-origin', () => {
            expect(this.res.headers['access-control-allow-origin']).to.equal('*')
          })

          it('sets the proper access-control-allow-methods', (done) => {
            chai.request(app)
              .options('/recent-media')
              .end((err, res) => {
                expect(res.headers['access-control-allow-methods']).to.equal('GET')

                done()
              })
          })
        })
      })
    })
  })
})
