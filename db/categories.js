const { client } = require("./client");



const createCategory = async (name) => {

    try {

        const { rows } = await client.query(`INSERT INTO "routineActivities"(name, priority)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`, [name, priority]);

        return rows[0];
    }

    catch (error) {
        console.error('error creating activity..', error);
        throw error;
    }
};
const getCategoryById = async (id) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error NAME..', error);
        throw error;
    }
};
const getAllCategories = async () => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error NAME..', error);
        throw error;
    }
};
const updateCategory = async ({id, name}) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error NAME..', error);
        throw error;
    }
};
const removeCategory = async (id) => {

    try {

        const { rows } = await client.query(``, []);

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