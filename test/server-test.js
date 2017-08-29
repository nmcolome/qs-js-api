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
        assert.property(allFoods[0], "id")
        assert.property(allFoods[0], "name")
        assert.property(allFoods[0], "calories")
        assert.equal(allFoods.length, 2)
        done()
      })
    })
  })

  // describe('GET /api/v1/foods/:id', () => {
  //   const foods = [{"id": 1, "name": "apple", "calories": 10},
  //                 {"id": 2, "name": "pineapple", "calories": 50},
  //                 {"id": 3, "name": "apple pie", "calories": 100}]
  //   const food = foods[0]

  //   // it('should return a specific food based on id', done => {
  //   //   this.request.get('/api/v1/foods/1', (error, response) => {
  //   //     if(error) {return done(error)}
  //   //     assert.deepEqual(JSON.parse(response.body), food, `${response.body} does not include ${foods}`)
  //   //     assert.property(JSON.parse(response.body), "id")
  //   //     assert.property(JSON.parse(response.body), "name")
  //   //     assert.property(JSON.parse(response.body), "calories")
  //   //     assert.equal(JSON.parse(response.body).length, 1)
  //   //     done()
  //   //   })
  //   // })

  //   it('should return a 200 status', done => {
  //     this.request.get('/api/v1/foods/1', (error, response) => {
  //       if(error) {return done(error)}
  //       assert.equal(response.statusCode, 200)
  //       done()
  //     })
  //   })

  //   // it('should return a 404 status if not found', done => {
  //   //   this.request.get('/api/v1/foods/1000', (error, response) => {
  //   //     if(error) {return done(error)}
  //   //     assert.equal(response.statusCode, 404)
  //   //     done()
  //   //   })
  //   // })
  // })

  // describe('POST /api/v1/foods', () => {
  //   // const foods = [{"id": 1, "name": "apple", "calories": 10},
  //   //               {"id": 2, "name": "pineapple", "calories": 50},
  //   //               {"id": 3, "name": "apple pie", "calories": 100}]
  //   const food = {"food": {"name": "blueberry pie", "calories": 150}}

  //   it('should create a new food record', done => {
  //     assert.equal(Object.keys(app.locals.foods).length, 3)

  //     this.request.post('/api/v1/foods', {form: food}, (error, response) => {
  //       if(error) {return done(error)}
  //       assert.equal(Object.keys(app.locals.foods).length, 4)
  //       done()
  //     })
  //   })

  //   // it('should return a 200 status', done => {
  //   //   this.request.get('/api/v1/foods', (error, response) => {
  //   //     if(error) {return done(error)}
  //   //     assert.equal(response.statusCode, 200)
  //   //     done()
  //   //   })
  //   // })

  //   // it('should return a 404 status if not found', done => {
  //   //   this.request.get('/api/v1/foods/1000', (error, response) => {
  //   //     if(error) {return done(error)}
  //   //     assert.equal(response.statusCode, 404)
  //   //     done()
  //   //   })
  //   // })
  // })
})
