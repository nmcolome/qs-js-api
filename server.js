const app = require('express')()
const request = require('request')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)

app.get('/api/v1/foods', (request, response) => {
  database.raw(`SELECT id, name, calories FROM foods`)
  .then(data => {
    response.json(data.rows)
  })
})

app.get('/api/v1/foods/:id', (request, response) => {
  const { id } = request.params
  database.raw(`SELECT id, name, calories FROM foods WHERE id=?`, [id])
  .then(data => {
    if (data.rows.length < 1) {
      return response.sendStatus(404)
    } else {
      response.json(data.rows)
    }
  })
})

app.post('/api/v1/foods', (request, response) => {
  const food = request.body
  const name = food.food.name
  const calories = food.food.calories
  if(name === "" || calories === "") {
    return response.sendStatus(400)
  } else {
    database.raw(
      'INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?) RETURNING id, name, calories',
      [name, calories, new Date]
    )
    .then((data) => {
      response.json(data.rows)
    })
  }
})

app.delete('/api/v1/foods/:id', (request, response) => {
  const { id } = request.params
  database.raw(`DELETE FROM foods WHERE id = ?`, [id])
  .then((data) => {
    if (data.rowCount < 1) {
      response.sendStatus(404)
    } else {
      response.sendStatus(200)
    }
  })
})

app.put('/api/v1/foods/:id', (request, response) => {
  const { id } = request.params
  const updatedFood = request.body.food
  const name = updatedFood.name
  const calories = updatedFood.calories

  if(name === "" || calories === "") {
    response.sendStatus(400)
  } else {
    database.raw(`UPDATE foods SET name = ?, calories = ? WHERE id = ? RETURNING id, name, calories`, [name, calories, id])
    .then(data => {
      if(data.rowCount < 1) {
        response.sendStatus(404)
      } else {
        response.json(data.rows[0])
      }
    })
  }
})

app.get('/api/v1/meals', (request, response) => {
  database.raw(`SELECT meals.id, meals.name, foods.id AS food_id, foods.name AS food_name, foods.calories
                FROM meals
                JOIN meal_foods
                ON meals.id = meal_foods.meal_id
                JOIN foods
                ON meal_foods.food_id = foods.id
                GROUP BY meals.id, meals.name, foods.id
                ORDER BY meals.id`)
  .then(data => {
    const breakfastObject = {foods: []}
    const lunchObject = {foods: []}
    const dinnerObject = {foods: []}
    const snackObject = {foods: []}
    const allMeals = []

    data.rows.forEach(function(meal) {
      if (meal.id === 1) {
        breakfastObject["id"] = meal.id
        breakfastObject["name"] = meal.name
        breakfastObject["foods"].push({"id": meal.food_id, "name": meal.food_name, "calories": meal.calories})
      } else if (meal.id === 2) {
        snackObject["id"] = meal.id
        snackObject["name"] = meal.name
        snackObject["foods"].push({"id": meal.food_id, "name": meal.food_name, "calories": meal.calories})
      } else if (meal.id === 3) {
        lunchObject["id"] = meal.id
        lunchObject["name"] = meal.name
        lunchObject["foods"].push({"id": meal.food_id, "name": meal.food_name, "calories": meal.calories})
      } else if (meal.id === 4) {
        dinnerObject["id"] = meal.id
        dinnerObject["name"] = meal.name
        dinnerObject["foods"].push({"id": meal.food_id, "name": meal.food_name, "calories": meal.calories})
      }
    })

    allMeals.push(breakfastObject)
    allMeals.push(snackObject)
    allMeals.push(lunchObject)
    allMeals.push(dinnerObject)

    response.json(allMeals)
  })
})

app.get('/api/v1/meals/:meal_id/foods', (request, response) => {
  const id = request.params.meal_id

  database.raw(`SELECT meals.id, meals.name, foods.id AS food_id, foods.name AS food_name, foods.calories
                FROM meals
                JOIN meal_foods
                ON meals.id = meal_foods.meal_id
                JOIN foods
                ON meal_foods.food_id = foods.id
                WHERE meals.id = ?
                GROUP BY meals.id, meals.name, foods.id
                ORDER BY meals.id`,
                [id]
                )
  .then(data => {
    const mealObject = {foods: []}
    data.rows.forEach(function(meal) {
      mealObject["id"] = meal.id
      mealObject["name"] = meal.name
      mealObject["foods"].push({"id": meal.food_id, "name": meal.food_name, "calories": meal.calories})
    })
    return mealObject
  })
  .then(mealObject => {
    response.json(mealObject)
  })
})

app.delete('/api/v1/meals/:meal_id/foods/:food_id', (request, response) => {
  const meal_id = request.params.meal_id
  const food_id = request.params.food_id

  database.raw(`DELETE FROM meal_foods WHERE food_id = ? AND meal_id = ?`, [food_id, meal_id])
  .then((data) => {
    if (data.rowCount < 1) {
      response.sendStatus(404)
    } else {
      response.sendStatus(200)
    }
  })
})

app.listen(app.get('port'))

module.exports = app
