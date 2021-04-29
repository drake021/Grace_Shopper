const { getCategoryById } = require("./categories");
const { client } = require("./client");
const { testFirstRow, getNestedTable, deleteReferencedTable } = require("./api");
const { getItemCategoriesByItem } = require("./itemCategories");

//creates new item row in DB
const createItem = async ({ itemNumber, description, name, cost, price, onHand }) => {

    try {

        const { rows } = await client.query(`INSERT INTO items("itemNumber", "description", name, cost, price, "onHand")
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT ("itemNumber") DO NOTHING 
                RETURNING *;`, [itemNumber.toUpperCase(), description, name, cost, price, onHand]);
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
const getItemById = async (id) => {
    try {

        const promisedDraftItem = await getNestedTable('items', 'id', 'categories', getItemCategoriesByItem, Number(id));
        const draftItem = await Promise.all(promisedDraftItem);
        console.log('draftItem: ', draftItem);
        if (!!draftItem.categories) {
            draftItem.categories = draftItem.categories.map(async (categoryItem) => {
                return await getCategoryById(categoryItem.categoryId);
            });
        }
        return draftItem;
    }

    catch (error) {
        console.error('error getItemById..', error);
        throw error;
    }

    // returns an item object
};
//return item object in database by itemNumber
const getItemByItemNumber = async (itemNumber) => {
    try {
        const draftItem = await getNestedTable('items', '"itemNumber"', 'categories', getItemCategoriesByItem, itemNumber)[0];
        draftItem.categories = draftItem.categories.map(async (categoryItem) => {
            return await getCategoryById(categoryItem.categoryId);
        });
        return draftItem;
    }

    catch (error) {
        console.error('error creating item..', error);
        throw error;
    }
};
//returns all item objects in database

const getAllItems = async () => {
    try {
        const _ = null;
        const promisedItems = await getNestedTable('items', _, 'categories', getItemCategoriesByItem, _);
        const draftItems = await Promise.all(promisedItems);
        const promisedResult = draftItems.map(async draftItem => {
            if (!!draftItem.categories) {
                const promisedCategories = draftItem.categories.map(async (categoryItem) => {
                    console.log("categoryItem: ", categoryItem)
                    return await getCategoryById(categoryItem.categoryId);
                    
                });
                console.log('promisedCategories: ', promisedCategories);
                draftItem.categories = await Promise.all(promisedCategories);
            }
            console.log('draftItem: ', draftItem);
            return draftItem;
        });
        
        const result = await Promise.all(promisedResult);
        console.log('final allItems: ', result);
        return result;
    }

    catch (error) {
        console.error('error getAllItems..', error);
        throw error;
    }
};
//updates an item row by id
const updateItem = async ({ id, name, description, cost, price, onHand }) => {
    [valuesArray, queryValuesString] = getQueryValuesString();
    const valuesArray = [name, description, cost, price, onHand, id]
    try {

        const { rows } = await client.query(`UPDATE items ${queryValuesString}`, valuesArray);
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

const removeItem = async (id) => {
    try {
        return await deleteReferencedTable('items', '"itemCategories"', '"itemId"', id);
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