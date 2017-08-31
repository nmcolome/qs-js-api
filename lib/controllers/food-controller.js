const Food = require('../models/food')

class FoodController {
  static getAllFoods(response){
    Food.getAllFoods()
    .then(data => {
      FoodController.jsonify(data.rows, response)
    })
  }

  static getOneFood(request, response) {
    const { id } = request.params
    Food.getOneFood(id)
    .then(data => {
      if (data.rows.length < 1) {
        response.sendStatus(404)
      } else {
        FoodController.jsonify(data.rows, response)
      }
    })
  }

  static createFood(request, response) {
    const food = request.body
    const name = food.food.name
    const calories = food.food.calories

    if(name === "" || calories === "") {
      response.sendStatus(400)
    } else {
      Food.createFood(name, calories)
      .then((data) => {
        FoodController.jsonify(data.rows, response)
      })
    }
  }

  static deleteFood(request, response) {
    const { id } = request.params
    Food.deleteFood(id)
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
      Food.updateFood(name, calories, id)
      .then(data => {
        if(data.rowCount < 1) {
          return response.sendStatus(404)
        } else {
          FoodController.jsonify(data.rows[0], response)
        }
      })
    }
  }

  static jsonify(data, response) {
    return response.json(data)
  }
}

module.exports = FoodController
