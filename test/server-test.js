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

  beforeEach(done => {
    database.seed.run()
    .then(() => done())
  })

  after(() => {
    this.server.close()
  })

  afterEach(done => {
    Promise.all([
      database.raw(`TRUNCATE foods RESTART IDENTITY CASCADE`),
      database.raw(`TRUNCATE meals RESTART IDENTITY CASCADE`)
      // database.raw(`TRUNCATE meal_foods RESTART IDENTITY CASCADE`),
    ])
    .then(() => done())
  })

  it('exists', () => {
    assert(app.locals)
  })

  describe('GET /api/v1/foods', () => {
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
        assert.hasAllKeys(allFoods[0], ["id", "name", "calories"])
        assert.equal(allFoods.length, 12)
        done()
      })
    })
  })

  describe('GET /api/v1/foods/:id', () => {
    it('should return a specific food based on id', done => {
      this.request.get('/api/v1/foods/1', (error, response) => {
        if(error) {return done(error)}
        const food = JSON.parse(response.body)
        assert.equal(food[0].id, 1)
        assert.equal(food[0].name, "Banana")
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
    it('should create a new food record', done => {
      const food = { "food": { "name": "apple", "calories": 10 } }
      this.request.post('/api/v1/foods', {form: food}, (error, response) => {
        if(error) {return done(error)}
        const foodResponse = JSON.parse(response.body)
        // console.log(foodResponse)
        assert.hasAllKeys(foodResponse, ["id", "name", "calories"])
        assert(foodResponse.name, "apple")
        assert(foodResponse.id, 10)
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

  describe('PUT /api/v1/foods/:id', () => {
    it('should return 200 and an updated food record', done => {
      const food = { "food": { "name": "pear", "calories": 12}}
      this.request.put('/api/v1/foods/1', {form: food}, (error, response) => {
        if(error) {return done(error)}
        const updatedFood = JSON.parse(response.body)

        assert.equal(response.statusCode, 200)
        assert.hasAllKeys(updatedFood, ["id", "name", "calories"])
        assert.equal(updatedFood.id, 1)
        assert.equal(updatedFood.name, "pear")
        assert.notEqual(updatedFood.name, "apple")
        done()
      })
    })

    it('should return 404 if resource not found', done => {
      const food = { "food": { "name": "pear", "calories": 12}}

      this.request.put('/api/v1/foods/0', {form: food}, (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should return 400 if a field is empty', done => {
      const food = { "food": { "name": "", "calories": 12}}

      this.request.put('/api/v1/foods/1', {form: food}, (error, response) => {
        if(error) {return done(error)}
        assert.equal(response.statusCode, 400)
        done()
      })
    })
  })

  describe('GET /api/v1/meals', () => {
    it('returns all meals with their associated foods', () => {
      this.request.get('/api/v1/meals', (error, response) => {
        if(error) { return done(error) }
        console.log(response.body)
        const meals = JSON.parse(response.body)
        const oneMeal = meals[0]
        assert.equal(meals.length, 4)
        assert.hasAllKeys(oneMeal, ["id", "name", "foods"])
        assert.hasAllKeys(oneMeal["foods"][0], ["id", "name", "calories"])
        done()
      })
    })
  })
})
