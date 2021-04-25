const { client } = require("./client");

const createItemCategory = async ({ itemId, categoryId }) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error createItemCategory..', error);
        throw error;
    }
};
const getItemCategoriesByItem = async (itemId) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error getItemCategoriesByItem..', error);
        throw error;
    }
};
const getItemCategoriesByCategory = async (categoryId) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error getItemCategoriesByCategory..', error);
        throw error;
    }
};
const removeItemCategory = async (id) => {

    try {

        const { rows } = await client.query(``, []);

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