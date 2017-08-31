const express = require('express')
const app = express()
const request = require('request')
const cors = require('cors')
const bodyParser = require("body-parser")

const FoodController = require('./lib/controllers/food-controller')
const Meal = require('./lib/models/meal')
const mealController = require('./lib/controllers/meals_controller')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)

app.use("/styles", express.static(__dirname + '/styles'));

app.get('/', (request, response) => {
  response.sendFile('index.html', {root: './'})
})

app.get('/api/v1/foods', (request, response) => {
  FoodController.getAllFoods(response)
})

app.get('/api/v1/foods/:id', (request, response) => {
  FoodController.getOneFood(request, response)
})

app.post('/api/v1/foods', (request, response) => {
  FoodController.createFood(request, response)
})

app.delete('/api/v1/foods/:id', (request, response) => {
  FoodController.deleteFood(request, response)
})

app.put('/api/v1/foods/:id', (request, response) => {
  FoodController.updateFood(request, response)
})

app.get('/api/v1/meals', (request, response) => {
  mealController.index(request, response)
})

app.get('/api/v1/meals/:meal_id/foods', (request, response) => {
  mealController.showMeal(request, response)
})

app.delete('/api/v1/meals/:meal_id/foods/:food_id', (request, response) => {
  mealController.deleteFood(request, response)
})

app.post(`/api/v1/meals/:meal_id/foods/:food_id`, (request, response) => {
  mealController.postFood(request, response)
})

app.listen(app.get('port'))

module.exports = app
