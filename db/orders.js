

const { client } = require("./client");
const { testFirstRow, getQueryValuesString } = require(".");


//creates order; line items attached seperately
const createOrder = async ({ userId, attn, email, phoneNumber, address, address2, zip, state }) => {
    let dynamicArray = [];
    let dynamicArrayNames = [];
    const verifyValue = (value, type = 'string', name) => {
        if (typeof (value) === type) {
            dynamicArray.push(value);
            dynamicArrayNames.push(name);
        }
    };
    const getQueryValuesString = () => {
        let queryValuesString = `(`;
        verifyValue(admin, 'boolean', 'admin');
        verifyValue(userId, 'number', '"userId"');
        verifyValue(attn, _, 'attn');
        verifyValue(firstName, _, '"firstName"');
        verifyValue(lastName, _, '"lastName"');
        verifyValue(firstName, _, '"firstName"');
        verifyValue(email, _, 'email');
        verifyValue(phoneNumber, _, 'phoneNumber');
        verifyValue(address, _, 'address');
        verifyValue(address2, _, 'address2');
        verifyValue(zip, _, 'zip');
        verifyValue(state, _, 'state');
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
const getOrderById = (id) => {
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

//updates the order row in database *note line items are handled seperately*
const updateOrder = ({ id, attn, email, phoneNumber, address, address2, zip, state }) => {
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
const getOrdersByUserId = (id) => {
    console.log('running getOrdersByUserId..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM orders
            WHERE "userId"=$1;`, [id]);
        testFirstRow(rows);
        rows.map(async order => {
            const lineItems = await getLineItemsByOrder(order.id).rows;
            const newOrder = { ...order, lineItems: lineItems };
            return newOrder;
        })
        return rows;
    }

    catch (error) {
        console.error('error getting orders by user id..', error);
        throw error;
    }
}

//deletes the order row in DB by id; will delete lineItems associated with the order first
const deleteOrder = (id) => {
    console.log('running deleteOrder..');
    try {

        const lineItems = await client.query(`
            DELETE FROM "lineItems"
            WHERE "orderId"=$1
            RETURNING *;`, [id]).rows;
        testFirstRow(lineItems);
        const { rows } = await client.query(`
            DELETE FROM orders
            WHERE "id"=$1
            RETURNING *;`, [id]);
        testFirstRow(rows);

        return { ...rows[0], lineItems };
    }

    catch (error) {
        console.error('error deleting order by id..', error);
        throw error;
    }
    //returns null
};

//order object returned

// {
//     id: 0,
//     userId: null,
//     attn: 'Rick Scott',
//     email: 'person@site.com',
//     phoneNumber: '904-294-1924',
//     address: 'string',
//     address2: 'string',
//     zip: '32224',
//     state: 'FL',
//     lineItems: [
//         {
//             item:  {
//                     id: 0,
//                     itemNumber: 'REDSHIRT', //item number will always be converted to caps. only '_' and '-' special characters
//                     name: 'Red T-Shirt',
//                     description: 'A mervelous red shirt, the tee kind.',
//                     cost: 5.48,
//                     price: 8.99,
//                     onHand: 22,
//                     allocated: 4,
//                     categories: [{id: 0, name: 'shirts'}, {id:1, name: 'pants'}]
//                 },
//             qty: 22
//         },
//          {ect..},
//          {ect...}
//     ]

// }

module.exports = {
    createOrder,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
}