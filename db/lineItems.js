const { testFirstRow, getQueryValuesString } = require("./api");
const { client } = require("./client");

//attaches a lineItem to order
//technically works
const createLineItem = async ({ itemId, orderId, quantity, cost, price, name, description }) => {

    try {
        const valuesArray = [itemId, orderId, quantity, cost, price, name, description];
        console.log('creating lineItm sql')
        const { rows } = await client.query(`INSERT INTO "lineItems"("itemId", "orderId", quantity, cost, price, name, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`, valuesArray);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error createLineItem..', error);
        throw error;
    }
};
//returns lines items in order
const getLineItemsByOrder = async (id) => {

    try {

        const { rows } = await client.query(`SELECT * FROM "lineItems" 
        WHERE "orderId"=($1);`, [id]);
        console.log("lines items of order: ", rows);
        return rows;
    }

    catch (error) {
        console.error('error getLineItemsByOrder..', error);
        throw error;
    }
};
//updates lineItems, id & min 1 value req.
const updateLineItem = async ({ id, quantity, cost, price, name, description }) => {

    try {
        const [valuesArray, queryValuesString] = getQueryValuesString([
            {
                name: "quantity",
                value: quantity,
                type: "number"
            },
            {
                name: "cost",
                value: cost,
                type: "number"
            },
            {
                name: "price",
                value: price,
                type: "number"
            },
            {
                name: "name",
                value: name,
                type: "string"
            },
            {
                name: "description",
                value: description,
                type: "string"
            }
        ], id);
        console.log('UPDATE "lineItems" ' + queryValuesString);
        console.log(valuesArray);
        const { rows } = await client.query(`UPDATE "lineItems" 
        ${queryValuesString}`);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error updateLineItem..', error);
        throw error;
    }
};
//removes lineItem
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