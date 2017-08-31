exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meal_foods RESTART IDENTITY')
  .then(function() {
    return Promise.all([
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [3, 1]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [5, 1]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [7, 1]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [9, 2]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [2, 2]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [10, 2]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [4, 3]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [7, 3]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [1, 3]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [6, 4]),
      knex.raw('INSERT INTO meal_foods (food_id, meal_id) VALUES (?, ?)', [11, 4])
    ])
  })
};
