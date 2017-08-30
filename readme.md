#### Welcome to Quantified Self! A calorie counter that kinda works!

This app's intent is to give users a space to see how many calories they have consumed in a day. Not only that! It also allows you to compare how the calories consumed compare to their goals! Watch out, text turns red if you eat too much!

You'll need to do a little prep work to set this app up on your own computer.

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
