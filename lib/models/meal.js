const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)


const allFoods = () => {
  return database.raw(`SELECT meals.id, meals.name, foods.id AS food_id, foods.name AS food_name, foods.calories
  FROM meals
  JOIN meal_foods
  ON meals.id = meal_foods.meal_id
  JOIN foods
  ON meal_foods.food_id = foods.id
  GROUP BY meals.id, meals.name, foods.id
  ORDER BY meals.id`)
}

const getFoods = (id) => {
  return database.raw(`SELECT meals.id, meals.name, foods.id AS food_id, foods.name AS food_name, foods.calories
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
}

const deleteFood = (food_id, meal_id) => {
  return database.raw(`DELETE FROM meal_foods WHERE food_id = ? AND meal_id = ?`, [food_id, meal_id])
}

const postFood = (meal_id, food_id) => {
  return database.raw(`INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)`, [meal_id, food_id])
}

module.exports = {
  allFoods,
  getFoods,
  deleteFood,
  postFood
}