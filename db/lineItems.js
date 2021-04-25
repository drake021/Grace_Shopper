const { client } = require("./client");

const createLineItem = async ({ itemId, orderId, quantity, cost, price, name, description }) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error createLineItem..', error);
        throw error;
    }
};
const getLineItemsByOrder = async () => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error getLineItemsByOrder..', error);
        throw error;
    }
};
const updateLineItem = async ({ id, quantity, cost, price, name, description }) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error updateLineItem..', error);
        throw error;
    }
};
const removeLineItem = async (id) => {

    try {

        const { rows } = await client.query(``, []);

        return rows[0];
    }

    catch (error) {
        console.error('error removeLineItem..', error);
        throw error;
    }
};

// need to implement updateLineItem on server

module.exports = {
    createLineItem,
    getLineItemsByOrder,
    removeLineItem,
    updateLineItem
}