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

module.exports = app