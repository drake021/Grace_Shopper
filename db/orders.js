

const { client } = require("./client");
const { testFirstRow, getQueryValuesString, getNestedTable } = require("./api");
const { getLineItemsByOrder } = require("./lineItems");


//creates order; line items attached seperately
const createOrder = async ({ userId, attn, email, phoneNumber, address, address2, zip, state }) => {
    console.log('creating orders...');
    console.log(userId, attn, email, phoneNumber, address, address2, zip, state);
    let dynamicArray = [];
    let dynamicArrayNames = [];
    const verifyValue = (value, type = 'string', name) => {
        if (type === null) { type='string' };
        if (typeof (value) === type) {
            dynamicArray.push(value);
            dynamicArrayNames.push(name);
        }
    };
    const _ = null;
    const getQueryValuesString = () => {
        console.log('getting query string..');
        let queryValuesString = `(`;
        verifyValue(userId, 'number', '"userId"');
        verifyValue(attn, _, 'attn');
        verifyValue(email, _, 'email');
        verifyValue(phoneNumber, _, '"phoneNumber"');
        verifyValue(address, _, 'address');
        verifyValue(address2, _, 'address2');
        verifyValue(zip, _, 'zip');
        verifyValue(state, _, 'state');
        console.log(dynamicArray, dynamicArrayNames);
        if (dynamicArray.length < 1) {
            throw { name: 'error_noInputValues', message: 'missing input values for database' }
        }
        queryValuesString = queryValuesString + `${dynamicArrayNames[0]}`;

        if (dynamicArray.length > 1) {
            for (let i = 1; dynamicArray.length > i; i++) {
                queryValuesString = queryValuesString + `, ${dynamicArrayNames[i]}`;
            }
        }
        queryValuesString = queryValuesString + ') VALUES ($1';
        if (dynamicArray.length > 1) {
            for (let i = 1; dynamicArray.length > i; i++) {
                queryValuesString = queryValuesString + `, $${i + 1}`;
            }
        }
        queryValuesString = queryValuesString + ') ';

        return queryValuesString;
    };

    try {
        //if there are no values passed in except token and id; this should error out as no values provided
        const queryValuesString = getQueryValuesString();
        // console.log('queryString: ', queryValuesString);
        const { rows } = await client.query(`
        INSERT INTO orders
        ${queryValuesString}
        RETURNING *;`, dynamicArray);
        testFirstRow(rows);
        return rows[0];
        // returns user object of updated row (not password);
    }
    catch (error) {
        console.error('error creating order..', error);
        throw error;
    }
    //returns new order object
};

//retrieves order row from DB, includes linesItems
const getOrderById = async (id) => {
    console.log('running getOrderById..');

    try {
        const { rows } = await client.query(`
            SELECT * FROM orders
            WHERE id=$1;`, [id]);
        testFirstRow(rows);
        const lineItems = await getLineItemsByOrder(id).rows;
        testFirstRow(lineItems);
        return { ...rows[0], lineItems: lineItems };
    }

    catch (error) {
        console.error('error getting order by id..', error);
        throw error;
    }
    //returns order object
};

//gets all order rows from DB, includes lineItems

//updates the order row in database *note line items are handled seperately*
const updateOrder = async ({ id, attn, email, phoneNumber, address, address2, zip, state }) => {
    console.log('running updateOrder..');

    try {
        const [valuesArray, queryValuesString] = getQueryValuesString([
            {
                name: 'attn',
                value: attn,
                type: 'string'
            },
            {
                name: 'email',
                value: email,
                type: 'string'
            },
            {
                name: '"phoneNumber"',
                value: phoneNumber,
                type: 'string'
            },
            {
                name: 'address',
                value: address,
                type: 'string'
            },
            {
                name: 'address2',
                value: address2,
                type: 'string'
            },
            {
                name: 'zip',
                value: zip,
                type: 'string'
            },
            {
                name: 'state',
                value: state,
                type: 'string'
            }
        ], id);
        // console.log('queryString: ', queryValuesString);
        const { rows } = await client.query(`
            UPDATE orders 
            ${queryValuesString}`, valuesArray);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error updating order by id..', error);
        throw error;
    }
    //returns order object
};
//gets all orders by userId; includes lineItems
const getOrdersByUserId = async (id) => {
    console.log('running getOrdersByUserId..');
    try {

        return await getNestedTable('orders', '"userId"', "lineItems", getLineItemsByOrder, id);
    }

    catch (error) {
        console.error('error getting orders by user id..', error);
        throw error;
    }
}

//deletes the order row in DB by id; will delete lineItems associated with the order first
//NEEDS ADJUSTING
const deleteOrder = async (id) => {
    console.log('running deleteOrder..');
    try {

        const lineItems = await client.query(`
            DELETE FROM "lineItems"
            WHERE "orderId"=($1)
            RETURNING *;`, [id]);
            console.log(lineItems);
        const fields = await client.query(`
            DELETE FROM orders
            WHERE "id"=($1)
            RETURNING *;`, [id]);
            console.log(fields);

        return [ fields, lineItems ];
    }

    catch (error) {
        console.error('error deleting order by id..', error);
        throw error;
    }
    //returns null
};

module.exports = {
    createOrder,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
}