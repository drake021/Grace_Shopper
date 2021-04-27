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
  
  const deleteReferencedTable = async ({topTable, bottomTable, referenceName, id}) => {
    const deletedBottomRows = await client.query(`DELETE FROM $1  
    WHERE id=($2) 
    RETURNING *;`, [bottomTable, id]).rows;
    testFirstRow(deletedBottomRows);
    const deletedTopRow = await client.query(`DELETE FROM $1  
    WHERE $2=($3) 
    RETURNING *;`, [ topTable, referenceName, id ]).rows;
    testFirstRow(deletedTopRow);
    deletedTopRow[bottomTable] = deletedBottomRows;
    return deletedTopRow;
  
  };
  
  // searches firstTableName where firstTableRefId == id; then uses readSecondTable with id of each row in fristTable.
  //uses secondKey to store the array of rows into the first table object; returns array of firstTableObjects
  const getNestedTable = async (firstTableName, firstTableRefId, secondTableKey, readSecondTable, id) => {
    if (typeof(firstTableRefId) !== 'string' || typeof(id) !== 'number') {
      const queryString = `SELECT * FROM $1;`
      const valuesArray = [ firstTableName ];
    } else {
      const queryString = `SELECT * FROM $1 WHERE $2=($3);`
      const valuesArray = [ firstTableName, firstTableRefId, id ];
    };
    
    const { rows } = await client.query(queryString, valuesArray);
    testFirstRow(rows);
  
    const myMapFunction = async (secondTableKey, readSecondTable) => {
        return async (firstTableRow) => {
            const data = await readSecondTable(firstTableRow.id).rows;
            const result = { ...firstTableRow, secondTableKey: data };
            return result;
        }
    }
    const mapFirstTable = await myMapFunction(secondTableKey, readSecondTable);
    const result = rows.map(mapFirstTable);
    testFirstRow(result);
    return result;
  };
  
  module.exports = {
    testFirstRow,
    respError,
    getQueryValuesString,
    getNestedTable,
    deleteReferencedTable
}