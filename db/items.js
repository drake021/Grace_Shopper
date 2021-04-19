const { client } = require("./client");

//creates new item row in DB
const createItem = async ({ itemNumber, description, name, cost, price }) => {

    try {

        const { rows } = await client.query(`INSERT INTO items("itemNumber", "description", name, cost, price)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT ("itemNumber") DO NOTHING 
                RETURNING *;`, [itemNumber, description, name, cost, price]);

        return rows[0];
    }

    catch (error) {
        console.error('error creating item..', error);
        throw error;
    }
    //returns newly create item object
};

//reads item row by id, includes categories
const getItemById = (id) => {

    // returns an item object
};

//updates an item row by id
const updateItem = ({id, itemNumber, name, description, cost, price, onHand, allocated}) => {

    // returns updated item object
};

//deletes item row from DB
const deleteItem = (id) {

    // returns null or success message
};

// example item object
// {
//     id: 0,
//     itemNumber: 'REDSHIRT', //item number will always be converted to caps. only '_' and '-' special characters
//     name: 'Red T-Shirt',
//     description: 'A mervelous red shirt, the tee kind.',
//     cost: 5.48,
//     price: 8.99,
//     onHand: 22,
//     allocated: 4
//     categories: [{id: 0, name: 'shirts'}, {id:1, name: 'pants'}]
// }



module.exports = {
    createItem
}