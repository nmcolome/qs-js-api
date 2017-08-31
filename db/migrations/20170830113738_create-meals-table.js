
exports.up = function(knex, Promise) {
  let createMealsTable = `
    CREATE TABLE meals(
      id SERIAL PRIMARY KEY NOT NULL,
      name TEXT,
      created_at TIMESTAMP
    )`
  return knex.raw(createMealsTable)
};

exports.down = function(knex, Promise) {
  let dropMealsTable = `DROP TABLE meals`
  return knex.raw(dropMealsTable)
};
