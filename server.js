const app = require('express')()
const request = require('request')

app.locals.foods = [{"id": 1, "name": "apple", "calories": 10},
                    {"id": 2, "name": "pineapple", "calories": 50},
                    {"id": 3, "name": "apple pie", "calories": 100}]

app.get('/api/v1/foods', (request, response) => {
  response.send(app.locals.foods)
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