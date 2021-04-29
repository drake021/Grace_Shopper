const { client } = require("./client");
const { testFirstRow, respError } = require("./api");

const createCategory = async (name) => {

    try {

        const { rows } = await client.query(`INSERT INTO "categories"(name)
                VALUES ($1)
                RETURNING *;`, [name]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error creating activity..', error);
        throw error;
    }
};
const getCategoryById = async (id) => {

    try {

        const { rows } = await client.query(`SELECT * FROM categories WHERE id=$1;`, [id]);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error getCategoryById..', error);
        throw error;
    }
};
const getAllCategories = async () => {

    try {

        const { rows } = await client.query(`SELECT * FROM categories;`);
        testFirstRow(rows);

        return rows;
    }

    catch (error) {
        console.error('error getAllCategories..', error);
        throw error;
    }
};
const updateCategory = async ({id, name}) => {

    try {
        if ( typeof(name) !== "string" ) {
            throw respError('missingName', 'need to input valid string for name');
        }
        const { rows } = await client.query(`UPDATE categories 
        SET name=$1 
        WHERE id=($2)
        RETURNING *;`, [name, id]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error updateCategory..', error);
        throw error;
    }
};
//deletes category from DB by id
const removeCategory = async (id) => {

    try {
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
        return deleteReferencedTable('categories', '"itemCategories', 'categoryId', id);

    }

    catch (error) {
        console.error('error renoveCategory..', error);
        throw error;
    }
};
    

module.exports = {
    createCategory,
    getAllCategories,
    removeCategory,
    getCategoryById,
    updateCategory
}