const { client } = require("./client");
const { testFirstRow } = require("./index");

//creates new item row in DB
const createItem = async ({ itemNumber, description, name, cost, price, onHand }) => {

    try {

        const { rows } = await client.query(`INSERT INTO items("itemNumber", "description", name, cost, price, "onHand")
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT ("itemNumber") DO NOTHING 
                RETURNING *;`, [itemNumber, description, name, cost, price, onHand]);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error creating item..', error);
        throw error;
    }
    //returns newly create item object
};

//reads item row by id, includes categories
// NEEDS TO INCLUDE CATEGORIES
const getItemById = (id) => {
    try {

        const { rows } = await client.query(`SELECT * FROM items WHERE id=($1);`, [id]);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error creating item..', error);
        throw error;
    }

    // returns an item object
};
//return item object in database by itemNumber
//NEEDS TO INCLUDE CATEGORIES
const getItemByItemNumber = (itemNumber) => {
    try {

        const { rows } = await client.query(`SELECT * FROM items WHERE "itemNumber"=($1);`, [itemNumber]);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error creating item..', error);
        throw error;
    }
};
//returns all item objects in database
//NEEDS TO INCLUDE CATEGORIES
const getAllItems = () => {
    try {
        const { rows } = await client.query(`SELECT * FROM items;`);
        testFirstRow(rows);
        return rows;
    }

    catch (error) {
        console.error('error creating item..', error);
        throw error;
    }
};
//updates an item row by id
//should update this so some fields are optional
const updateItem = ({ id, name, description, cost, price, onHand }) => {
    const valuesArray = [name, description, cost, price, onHand, id]
    try {

        const { rows } = await client.query(`UPDATE items 
        SET name=$1, description=$2, cost=($3), price=($4), "onHand"=($5)
        WHERE id=($6);`, valuesArray);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error updating item..', error);
        throw error;
    }
    // returns updated item object
};

//deletes item row from DB
//NEEDS TO DELETE ITEM CATEGORIES THAT ARE ASSOCIATED
const removeItem = (id) => {
    try {
        const { rows } = await client.query(`DELETE FROM items WHERE id=($1) RETURNING *;`, [id]);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error updating item..', error);
        throw error;
    }
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
    createItem,
    getAllItems,
    getItemById,
    getItemByItemNumber,
    updateItem,
    removeItem
}