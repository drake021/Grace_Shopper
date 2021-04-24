<<<<<<< HEAD
// Connect to DB
const { Client } = require('pg');
const DB_NAME = 'change-this-name'
const DB_URL = process.env.DATABASE_URL || `postgres://${ DB_NAME }`;
const client = new Client(DB_URL);

// database methods

// export
module.exports = {
  client,
  // db methods
}
=======
// require and re-export all files in this db directory (users, activities...)
module.exports = {
    ...require('./users'), // adds key/values from users.js
    ...require('./client') // etc
  }
>>>>>>> af87f2a15cd44b2cc80d0da51e13cadfb8a3d8cf
