
// require and re-export all files in this db directory (users, activities...)
module.exports = {
  ...require('./users'), // adds key/values from users.js
  ...require('./client'), // etc
  ...require('./orders'),
  ...require('./items'),
  ...require('./lineItems'),
  ...require('./categories'),
  ...require('./itemCategories'),
  ...require('./api')
}
