const { client } = require("./client");
const { testFirstRow } = require("./index");

const createCategory = async (name) => {

    try {

        const { rows } = await client.query(`INSERT INTO "routineActivities"(name, priority)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`, [name, priority]);
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

        return rows[0];
    }

    catch (error) {
        console.error('error getAllCategories..', error);
        throw error;
    }
};
const updateCategory = async ({id, name}) => {

    try {

        const { rows } = await client.query(`UPDATE categorioes 
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
//NEEDS TO DELETE ITEM CATEGORIES ASSOCIATED FIRST
const removeCategory = async (id) => {

    try {

        const { rows } = await client.query(`DELETE FROM categories 
        WHERE id=($1) 
        RETURNING *;`, [id]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error NAME..', error);
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