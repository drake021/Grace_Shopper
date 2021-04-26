const testFirstRow = rows => {
  if (!rows[0]) {
    throw respError('notFound', 'could not find queried row');
  }
};
const respError = (name, message) => {
  return {
    name: `error_${name}`,
    message,
    error: message
  };
};
const getQueryValuesString = (objectsArray, id) => {
  let dynamicArray = [];
  let dynamicArrayNames = [];
  let queryValuesString = `SET `;
  objectsArray.forEach(object => {
    if (typeof (object.value) === object.type) {
      dynamicArray.push(object.value);
      dynamicArrayNames.push(object.name);
    };
  });
  if (dynamicArray.length < 1) {
    throw { name: 'error_noInputValues', message: 'missing input values for database' }
  };
  queryValuesString = queryValuesString + `${dynamicArrayNames[0]}=$1`;
  if (dynamicArray.length > 1) {
    for (let i = 1; dynamicArray.length > i; i++) {
      queryValuesString = queryValuesString + `, ${dynamicArrayNames[i]}=$${i + 1}`;
    }
  };
  dynamicArray.push(id);
  queryValuesString = queryValuesString + ` WHERE id=$${dynamicArray.length} RETURNING *;`;

  return [dynamicArray, queryValuesString];
};




// require and re-export all files in this db directory (users, activities...)
module.exports = {
  ...require('./users'), // adds key/values from users.js
  ...require('./client'), // etc
  ...require('./orders'),
  ...require('./items'),
  ...require('./lineItems'),
  ...require('./categories'),
  ...require('./itemCategories'),
  testFirstRow,
  respError,
  getQueryValuesString
}