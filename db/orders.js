

const { client } = require("./client");

const createOrder = async ({userId, attn, email, phoneNumber, address, address2, zip, state}) => {
    console.log('running createOrder ..');
    try {

        const { rows } = await client.query(`INSERT INTO orders("userId", attn, email, "phoneNumber", address, address2, zip, state)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING 
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

    //returns order object
};

//updates the order row in database *note line items are handled seperately*
const updateOrder = ({id, attn, email, phoneNumber, address, address2, zip, state}) => {

    //returns order object
};

//deletes the order row in DB by id
const deleteOrder = (id) => {

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
    createOrder
}