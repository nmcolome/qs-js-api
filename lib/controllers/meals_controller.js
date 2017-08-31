const Meal = require('../models/meal')

const index = (request, response) => {
  Meal.allFoods()
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
        mealObject["id"] = meal.id
        mealObject["name"] = meal.name
        mealObject["foods"].push({"id": meal.food_id, "name": meal.food_name, "calories": meal.calories})
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