const app = require('express')()
const request = require('request')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
    return response.sendStatus(422)
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

app.listen(app.get('port'))

module.exports = app
