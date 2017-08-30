exports.up = function(knex, Promise) {
  let createMealFoods = `CREATE TABLE meal_foods(
    id SERIAL PRIMARY KEY NOT NULL,
    food_id INTEGER REFERENCES foods(id),
    meal_id INTEGER REFERENCES meals(id)
  )`
  return knex.raw(createMealFoods)
};

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE meal_foods`
  return knex.raw(dropQuery)
};
