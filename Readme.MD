# JWT AUTHENTICATION DEMO EXAMPLE IN NODEJS

JWT Authentication demo example in NodeJS using ExpressJS, Passport, Sequelize and MySQL.

## Install

Remember! You have to execute the following command after cloning this repository:

```bash
npm install
```

## First steps

In /config/config.json you will find all you need to connect this project with your database. In this
case, I have used MySQL as db. Let's see:

```json
"development": {
    "username": "root",
    "password": "password",
    "database": "passport_dev",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }

```
You can (and must) change the username and password to your own credentials in your local MySQL configuration. You can also change the "database" field, that's the name the database will have.

To start working with this project, you have to run the following commands:

The first one is to create our new database in MySQL:
```bash
npx sequelize-cli db:create
```
Secondly, we have to execute our migrations. These will create the tables structure in our database, as well as the associations between entities and their attributes constrainsts. So let's run:

```bash
npx sequelize-cli db:migrate
```

Now we can run our application. 

```bash
npm start
```
# HAVE YOU CHANGED THE STRUCTURE OR TABLES IN DATABASE?

If you add new models and migrations, or deleted any table, or you just filled your database with lots of garbage, you can do all the previous steps BUT YOU HAVE TO RUN FIRST THE NEXT COMMAND:
```bash
npx sequelize-cli db:drop
```

## Where is this project running?

The server port by default is 3000. Run this and you will have this
beautiful backend in http://localhost:3000

## Ok, you have made a really good job but... where are the routes?

Every single route are in app.js. 

```
app.use('/', userRoutes);
```
If you want to go deeper in the project routes, you can always go to /routes and see which controller is associated to which route;

## What will I find in this project?

You will have three main API's in this project:

- First, the register api, which is a POST request with the following JSON structure:

```json
{
	"username": "elbarto",
	"password": "12345",
	"confirmPassword": "12345",
	"email": "elbarto@springfield.com",
	"firstName": "Bart",
	"lastName": "Simpson"
}
```

- Secondly, the login api, which is also a POST request with the following JSON structure:

```json
{
    "username": "elbarto",
    "password": "12345"
}
```
This request will give us our token.

- Finally, the getUsers api, which is a JWT protected GET request. 


... and that's all folks!

Any doubts, any suggestion, any request or any invitation to a good dinner, you can write an issue and I will read it as soon as I can.

## POSTMAN COLLECTION

Here you have a Postman collection with all requests:
https://www.getpostman.com/collections/fb0f7beb4fecabcbbbcd

## Autor

José Alberto Vázquez López

You can find me in: 
- Linkedin: https://www.linkedin.com/in/josealbertovazq/
- Twitter: https://twitter.com/JoseAlbertoVazq
- Instagram: https://www.instagram.com/JoseAlbertoVazq
- Facebook: https://www.facebook.com/JoseAlbertoVazq