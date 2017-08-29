const app = require('express')()
const request = require('request')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.get('/api/v1/foods', (request, response) => {
  database.raw(`SELECT * FROM foods`)
  .then(data => {
    response.json(data.rows)
  })
})

app.get('/api/v1/foods/:id', (request, response) => {
  const {id} = request.params
  const food = app.locals.foods[id]
  response.send(app.locals.foods)
  if (!food) {return response.statusCode(404).json({error: "Food not found"})}
})

app.post('/api/v1/foods', (request, response) => {
  const id = Date.now()
  const food = request.body
  const foodObject = {"id": id, "name": food.name, "calories": food.calories}

  // if(!food) {return response.status(422).json({error: "No food sent"})}
  app.locals.foods.push(foodObject)
  response.json(foodObject)
  response.status(201).end()
})

module.exports = app