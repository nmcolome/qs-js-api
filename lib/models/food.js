const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

class Food {
  static getAllFoods() {
    return database.raw(
      `SELECT id, name, calories
        FROM foods`
    )
  }

  static getOneFood(id) {
    return database.raw(
      `SELECT id, name, calories
        FROM foods WHERE id=?`,
      [id]
    )
  }

  static createFood(name, calories) {
    return database.raw(
      `INSERT INTO foods (name, calories, created_at)
        VALUES (?, ?, ?)
        RETURNING id, name, calories`,
      [name, calories, new Date]
    )
  }

  static deleteFood(id) {
    return database.raw(
      `DELETE FROM foods WHERE id = ?`,
      [id]
    )
  }

  static updateFood(name, calories, id) {
    return database.raw(
      `UPDATE foods SET name = ?, calories = ?
        WHERE id = ?
        RETURNING id, name, calories`,
      [name, calories, id]
    )
  }
}

module.exports = Food
