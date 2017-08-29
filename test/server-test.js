const assert = require('chai').assert
const app = require('../server')
const request = require('request')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

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

  describe('GET /api/v1/foods', () => {
    beforeEach((done) => {
      Promise.all([
        database.raw(
          'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
          ["apple", 12, new Date]
        ),
        database.raw(
          'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
          ["pineapple", 50, new Date]
        )
      ])
      .then(() => done())
    })

    afterEach(done => {
      database.raw(`TRUNCATE foods RESTART IDENTITY`)
      .then(() => done())
    })

    it('should return 200', done => {
      this.request.get('/api/v1/foods', (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should return a list of foods', done => {
      this.request.get('/api/v1/foods', (error, response) => {
        if(error) {return done(error)}
        const allFoods = JSON.parse(response.body)
        assert(response.body.includes('apple'))
        assert(response.body.includes('pineapple'))
        assert.hasAllKeys(allFoods[0], ["id", "name", "calories"])
        assert.equal(allFoods.length, 2)
        done()
      })
    })
  })

  describe('GET /api/v1/foods/:id', () => {
    beforeEach(done => {
      Promise.all([
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)', ["apple", 12, new Date])
        .then(() => done())
      ])
    })

    afterEach(done => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should return a specific food based on id', done => {
      this.request.get('/api/v1/foods/1', (error, response) => {
        if(error) {return done(error)}
        const food = JSON.parse(response.body)
        assert(response.body.includes("apple"), `${response.body} does not include ${food}`)
        assert.hasAllKeys(food[0], ["id", "name", "calories"])
        assert.equal(food.length, 1)
        done()
      })
    })

    it('should return a 200 status', done => {
      this.request.get('/api/v1/foods/1', (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should return a 404 status if not found', done => {
      this.request.get('/api/v1/foods/0', (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })

  describe('POST /api/v1/foods', () => {
    afterEach(done => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should create a new food record', done => {
      const food = { "food": { "name": "apple", "calories": 10 } }
      this.request.post('/api/v1/foods', {form: food}, (error, response) => {
        if(error) {return done(error)}
        const foodResponse = JSON.parse(response.body)
        assert.hasAllKeys(foodResponse[0], ["id", "name", "calories"])
        assert(response.body.includes("apple"))
        assert(response.body.includes(10))
        done()
      })
    })

    it('should return a 400 status if no name is included', done => {
      const food = { "food": { "name": "", "calories": 12 } }
      this.request.post('/api/v1/foods', {form: food}, (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 400)
        done()
      })
    })

    it('should return a 400 status if no calories is included', done => {
      const food = { "food": { "name": "apple", "calories": "" } }
      this.request.post('/api/v1/foods', {form: food}, (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 400)
        done()
      })
    })
  })

  describe('DELETE /api/v1/foods/:id', () => {
    beforeEach(done => {
      Promise.all([
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)', ["apple", 12, new Date]),
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)', ["pineapple", 50, new Date])
        .then(() => done())
      ])
    })

    afterEach(done => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should return 200 if it successfully deleted a food', done => {
      this.request.delete('/api/v1/foods/1', (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should return 404 if resource not found', done => {
      this.request.delete('/api/v1/foods/0', (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })
})
