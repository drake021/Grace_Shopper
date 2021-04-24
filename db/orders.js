

const { client } = require("./client");

const createOrder = async ({userId, attn, email, phoneNumber, address, address2, zip, state}) => {
    console.log('running createOrder ..');
    try {

        const { rows } = await client.query(`INSERT INTO orders("userId", attn, email, "phoneNumber", address, address2, zip, state)
                VALUES ($1, $2)
                RETURNING *;`, [userId, attn, email, phoneNumber, address, address2, zip, state]);

        return rows[0];
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
        if (!rows[0]) {
            throw {name: 'idNotExist', message: 'Order Id does not exist'}
        }
        //Will want to incliude line items array
        return rows[0];
    }

    catch (error) {
        console.error('error getting order by id..', error);
        throw error;
    }
    //returns order object
};

//updates the order row in database *note line items are handled seperately*
const updateOrder = ({id, attn, email, phoneNumber, address, address2, zip, state}) => {
    console.log('running updateOrder..');
    try {

        const { rows } = await client.query(`
            UPDATE orders
            SET attn=$1, email=$2, "phoneNumber"=$3, address=$4, address2=$5, zip=$6, state=$7
            WHERE id=$8
            RETURNING *;`, [attn, email, phoneNumber, address, address2, zip, state, id]);
        if (!rows[0]) {
            throw {name: 'idNotExist', message: 'Order Id does not exist'}
        }
        return rows[0];
    }

    catch (error) {
        console.error('error updating order by id..', error);
        throw error;
    }
    //returns order object
};

const getOrdersByUserId = (id) => {
    console.log('running getOrdersByUserId..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM orders
            WHERE "userId"=$1;`, [id]);
        if (!rows[0]) {
            throw {name: 'idNotExist', message: 'Order Id does not exist'}
        }
        return rows;
    }

    catch (error) {
        console.error('error getting orders by user id..', error);
        throw error;
    }
}

//deletes the order row in DB by id
const deleteOrder = (id) => {
    console.log('running deleteOrder..');
    try {

        const { rows } = await client.query(`
        DELETE FROM orders
        WHERE "id"=$1
        RETURNING *;`, [id]);
        if (!rows[0]) {
            throw {name: 'idNotExist', message: 'Order Id does not exist'}
        }
        return rows[0];
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