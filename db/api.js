const { client } = require('./client');
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
  /*
  {
    name, value, type
  }
  */
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
  queryValuesString = queryValuesString + `${dynamicArrayNames[0]}=${dynamicArray[0]}`;
  if (dynamicArray.length > 1) {
    for (let i = 1; dynamicArray.length > i; i++) {
      queryValuesString = queryValuesString + `, ${dynamicArrayNames[i]}=${dynamicArray[i]}`;
    };
  };
  queryValuesString = queryValuesString + ` WHERE id=${id} RETURNING *;`;

  return [dynamicArray, queryValuesString];
};

const deleteReferencedTable = async ({ topTable, bottomTable, referenceName, id }) => {
  const deletedBottomRows = await client.query(`DELETE FROM $1  
    WHERE id=($2) 
    RETURNING *;`, [bottomTable, id]).rows;
  const deletedTopRow = await client.query(`DELETE FROM $1  
    WHERE $2=($3) 
    RETURNING *;`, [topTable, referenceName, id]).rows;
  deletedTopRow[bottomTable] = deletedBottomRows;
  return deletedTopRow;

};

// searches firstTableName where firstTableRefId == id; then uses readSecondTable with id of each row in fristTable.
//uses secondKey to store the array of rows into the first table object; returns array of firstTableObjects
const getNestedTable = async (firstTableName, firstTableRefId, secondTableKey, readSecondTable, id) => {
  console.log('running getNestedTable...')
  let queryString;
  let valuesArray;
  console.log(firstTableRefId, typeof(firstTableRefId));
  console.log(id, typeof(id));
  if (typeof (firstTableRefId) !== 'string' || typeof (id) !== 'number') {
    console.log('tableRef and/or id not found!!!');
    queryString = `SELECT * FROM ${firstTableName};`
    valuesArray = [firstTableName];
  } else {
    console.log(`selecting * from ${firstTableName} where ${firstTableRefId} == ${id}`);
    queryString = `SELECT * FROM ${firstTableName} WHERE ${firstTableRefId}=(${id});`
    valuesArray = [];
  };

  const { rows } = await client.query(queryString);


  const myMapFunction = async (secondTableKey, readSecondTable) => {
    return async (firstTableRow) => {
      console.log('firstTableRow.id: ', firstTableRow.id);
      console.log('read function: ', readSecondTable);
      const data = await readSecondTable(firstTableRow.id);
      console.log('readSecondTable: ', data);
      const result = { ...firstTableRow };
      if ( !data ) {
        console.log('data.rows false')
        result[secondTableKey] = [];  
      } else {
        console.log('data.rows true')
        result[secondTableKey] = data;
      };
      console.log("nested result: ",  result)
      return result;
    }
  };

  const mapFirstTable = await myMapFunction(secondTableKey, readSecondTable);
  const result = rows.map(mapFirstTable);

  return result;
};

const insertQueryValuesString = (objectsArray, tableName) => {
  /*
  {
    name, value, type
  }
  */
  let dynamicArray = [];
  let dynamicArrayNames = [];
  let queryValuesString = `INSERT INTO  ${tableName}(`;
  objectsArray.forEach(object => {
    if (typeof (object.value) === object.type) {
      dynamicArray.push(object.value);
      dynamicArrayNames.push(object.name);
    };
  });
  if (dynamicArray.length < 1) {
    throw { name: 'error_noInputValues', message: 'missing input values for database' }
  };
  queryValuesString = queryValuesString + `${dynamicArrayNames[0]}`;
  if (dynamicArray.length > 1) {
    for (let i = 1; dynamicArray.length > i; i++) {
      queryValuesString = queryValuesString + `, ${dynamicArrayNames[i]}`;
    }
  };
  queryValuesString = queryValuesString + `) VALUES ($1`;
  if (dynamicArray.length > 1) {
    for (let i = 1; dynamicArray.length > i; i++) {
      queryValuesString = queryValuesString + `, $${i + 1}`
    };
    queryValuesString = queryValuesString + `) RETURNING *;`;
  }
  return [dynamicArray, queryValuesString];
};


module.exports = {
  testFirstRow,
  respError,
  getQueryValuesString,
  getNestedTable,
  deleteReferencedTable,
  insertQueryValuesString
}