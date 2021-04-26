const { testFirstRow } = require(".");
const { client } = require("./client");

const createLineItem = async ({ itemId, orderId, quantity, cost, price, name, description }) => {

    try {
        const valuesArray = [itemId, orderId, quantity, cost, price, name, description]
        const { rows } = await client.query(`INSERT INTO "lineItems"("itemId", "orderId", quantity, cost, price, name, description) 
        VALUES ($1, $2, $3, $4, $5, $76, $7)
        RETURNING *;`, [valuesArray]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error createLineItem..', error);
        throw error;
    }
};
const getLineItemsByOrder = async (id) => {

    try {

        const { rows } = await client.query(`SELECT * FROM 'lineItems' 
        WHERE "orderId"=$1;`, [id]);
        testFirstRow(rows);

        return rows;
    }

    catch (error) {
        console.error('error getLineItemsByOrder..', error);
        throw error;
    }
};
const updateLineItem = async ({ id, quantity, cost, price, name, description }) => {

    try {
        const valuesArray = [quantity, cost, price, name, description, id]
        const { rows } = await client.query(`UPDATE "lineItems" 
        SET quantity=($1), cost=($2), price=($3), name=$4, description=$5 
        WHERE id=($6) 
        RETURNING *;`, [valuesArray]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error updateLineItem..', error);
        throw error;
    }
};
const removeLineItem = async (id) => {

    try {

        const { rows } = await client.query(`DELETE FROM "lineItems" WHERE id=($1) RETURNING *`, [id]);
        testFirstRow(rows);

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