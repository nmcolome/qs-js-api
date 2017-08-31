You'll need to do a little prep work to set this api up on your own computer.

## to set up your environment:
- npm install nodemon --save-dev
- npm install knex pg --save
- npm install knex -g
- setup your local postges database with:
CREATE DATABASE quantified_self;
CREATE DATABASE quantified_self_test;
- knex init
- knex migrate:latest
- knex seed:run

## to run and see the beautifulness of the API:
- from your terminal, run 'nodemon'
- visit localhost:3000/api/v1/foods (etc)

### The following endpoints are available. All endpoints will return the data as JSON.

## Food Endpoints:
- GET /api/v1/foods - returns all foods currently in the database
- GET /api/v1/foods/:id - returns the food object with the specific :id you've passed in or 404 if the food is not found
- POST /api/v1/foods - allows creating a new food with the parameters:
{ food: { name: "Name of food here", calories: "Calories here"} }
If food is successfully created, the food item will be returned. If the food is not successfully created, a 400 status code will be returned. Both name and calories are required fields.
- PATCH /api/v1/foods/:id - allows one to update an existing food with the parameters:
{ food: { name: "Name of food here", calories: "Calories here"} }
If food is successfully updated (name and calories are required fields), the food item will be returned. If the food is not successfully updated, a 400 status code will be returned.
- DELETE /api/v1/foods/:id - will delete the food with the id passed in. If the food can't be found, a 404 will be returned.


## Meal Endpoints:
- GET /api/v1/meals - returns all the meals in the database along with their associated foods
- GET /api/v1/meals/:meal_id/foods - returns all the foods associated with the meal with an id specified by :meal_id or a 404 if the meal is not found
- POST /api/v1/meals/:meal_id/foods/:id - adds the food with :id to the meal with :meal_id
This creates a new record in the MealFoods table to establish the relationship between this food and meal. If the meal/food cannot be found, a 404 will be returned.
- DELETE /api/v1/meals/:meal_id/foods/:id - removes the food with :id from the meal with :meal_id
This deletes the existing record in the MealFoods table that creates the relationship between this food and meal. If the meal/food cannot be found, a 404 will be returned.
