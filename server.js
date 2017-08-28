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
  response.send(app.locals.foods)
})

module.exports = app