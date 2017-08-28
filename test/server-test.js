const assert = require('chai').assert
const app = require('../server')
const request = require('request')

describe('Server', () => {
  before((done) => {
    this.port = 9876
    this.server = app.listen(this.port, (err, result) => {
      if (err) {return done(err)}
      done()
    })
    this.request = request.defaults({
      baseUrl: "http://localhost:9876"
    })
  })

  after(() => {
    this.server.close()
  })

  it('exists', () => {
    assert(app.locals)
  })
})
