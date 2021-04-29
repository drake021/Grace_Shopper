const { testFirstRow, respError } = require("./api");
const { client } = require("./client");

const createItemCategory = async ({ itemId, categoryId }) => {

    try {

        const { rows } = await client.query(`INSERT INTO "itemCategories"("itemId", "categoryId")
        VALUES ($1, $2) RETURNING *;`, [itemId, categoryId]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error createItemCategory..', error);
        throw error;
    }
};
const getItemCategoriesByItem = async (itemId) => {

    try {

        const { rows } = await client.query(`SELECT * FROM "itemCategories" 
        WHERE "itemId"=($1);`, [itemId]);
        if(!rows[0]) {
            return [];
        }

        return rows;
    }

    catch (error) {
        console.error('error getItemCategoriesByItem..', error);
        throw error;
    }
};
const getItemCategoriesByCategory = async (categoryId) => {

    try {

        const { rows } = await client.query(`SELECT * FROM "itemCategories" 
        WHERE "categoryId"=($1)`, [categoryId]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error getItemCategoriesByCategory..', error);
        throw error;
    }
};
const removeItemCategory = async (id) => {

    try {

        const { rows } = await client.query(`DELETE FROM "itemCategories" 
        WHERE id=($1)
        RETURNING *;`, [id]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error removeItemCategory..', error);
        throw error;
    }
};




module.exports = {
    createItemCategory,
    getItemCategoriesByItem,
    getItemCategoriesByCategory,
    removeItemCategory
}