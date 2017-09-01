const Meal = require('../models/meal')

const index = (request, response) => {
  Meal.allFoods()
  .then(data => {
    const breakfastObject = {foods: []}
    const lunchObject = {foods: []}
    const dinnerObject = {foods: []}
    const snackObject = {foods: []}
    const allMeals = [breakfastObject, lunchObject, dinnerObject, snackObject]

    data.rows.forEach(function(meal) {
      if (meal.id === 1) {
        createMealObject(breakfastObject, meal)
      } else if (meal.id === 2) {
        createMealObject(lunchObject, meal)
      } else if (meal.id === 3) {
        createMealObject(dinnerObject, meal)
      } else if (meal.id === 4) {
        createMealObject(snackObject, meal)
      }
    })

    response.json(allMeals)
  })
}

const createMealObject = (mealName, meal) => {
  mealName["id"] = meal.id
  mealName["name"] = meal.name
  mealName["foods"].push({"id": meal.food_id, "name": meal.food_name, "calories": meal.calories})
}

const showMeal = (request, response) => {
  const id = request.params.meal_id

  Meal.getFoods(id)
  .then(data => {
    if(data.rows.length < 1) {
      response.sendStatus(404)
    } else {
      const mealObject = {foods: []}
      data.rows.forEach(function(meal) {
        createMealObject(mealObject, meal)
      })
      response.json(mealObject)
    }
  })
}

const deleteFood = (request, response) => {
  const meal_id = request.params.meal_id
  const food_id = request.params.food_id

  Meal.deleteFood(food_id, meal_id)
  .then((data) => {
    if (data.rowCount < 1) {
      response.sendStatus(404)
    } else {
      response.sendStatus(200)
    }
  })
}

const postFood = (request, response) => {
  const meal_id = request.params.meal_id
  const food_id = request.params.food_id

  Meal.postFood(meal_id, food_id)
  .then(data => {
    response.sendStatus(200)
  })
  .catch(() => {response.sendStatus(404)})
}

module.exports = {
  index,
  showMeal,
  deleteFood,
  postFood,
}
