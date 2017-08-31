const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

class Food {
  static getAllFoods(response) {
    database.raw(`SELECT id, name, calories FROM foods`)
    .then(data => {
      return response.json(data.rows)
    })
  }

  static getOneFood(request, response) {
    const { id } = request.params
    database.raw(`SELECT id, name, calories FROM foods WHERE id=?`, [id])
    .then(data => {
      if (data.rows.length < 1) {
        return response.sendStatus(404)
      } else {
        response.json(data.rows)
      }
    })
  }

  static createFood(request, response) {
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
  }

  static deleteFood(request, response) {
    const { id } = request.params
    database.raw(`DELETE FROM foods WHERE id = ?`, [id])
    .then((data) => {
      if (data.rowCount < 1) {
        response.sendStatus(404)
      } else {
        response.sendStatus(200)
      }
    })
  }

  static updateFood(request, response) {
    const { id } = request.params
    const updatedFood = request.body.food
    const name = updatedFood.name
    const calories = updatedFood.calories

    if(name === "" || calories === "") {
      return response.sendStatus(400)
    } else {
      database.raw(`UPDATE foods SET name = ?, calories = ? WHERE id = ? RETURNING id, name, calories`, [name, calories, id])
      .then(data => {
        if(data.rowCount < 1) {
          return response.sendStatus(404)
        } else {
          return response.json(data.rows[0])
        }
      })
    }
  }
}

module.exports = Food
