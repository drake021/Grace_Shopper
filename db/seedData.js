// require in the database adapter functions as you write them (createUser, createActivity...)
// const { } = require('./');
const { client } = require('./client');
// console.log('client is this in seedDate: ', client);
const {
  createUser,
  updateUser,
  createItem,
  createOrder,
  createLineItem,
  createCategory,
  createItemCategory
} = require('./index');


async function dropTables() {
  try {
    console.log('Dropping All Tables...');
    // drop all tables, in the correct order
    await client.query(`
  DROP TABLE IF EXISTS "itemCategories";
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS "lineItems";
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS items;
  DROP TABLE IF EXISTS users;
`);
  }
  catch (error) {
    console.error('error dropping tables...');
    throw error;
  }

}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    // create all tables, in the correct order
    //I would like email to be unique not null
    console.log('creating users..');
    await client.query(`
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN DEFAULT false,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    email VARCHAR(255),
    "phoneNumber" VARCHAR(255),
    address VARCHAR(255),
    address2 VARCHAR(255),
    zip VARCHAR(255),
    state VARCHAR(255)
  );`);
    console.log('creating items..');
    await client.query(`CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    "itemNumber" VARCHAR(16) UNIQUE NOT NULL,
    name VARCHAR(255),
    description VARCHAR(255),
    cost FLOAT(12),
    price FLOAT(12),
    "onHand" INT,
    allocated INT
  );`);
    console.log('creating orders..');
    await client.query(`CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    "userId" INT REFERENCES users(id),
    attn VARCHAR(255),
    email VARCHAR(255),
    "phoneNumber" VARCHAR(255),
    address VARCHAR(255),
    address2 VARCHAR(255),
    zip VARCHAR(255),
    state VARCHAR(255)
  );`);
    console.log('creating lineItems..');
    await client.query(`CREATE TABLE "lineItems" (
    id SERIAL PRIMARY KEY,
    "orderId" INT,
    "itemId" INT,
    ln INT,
    quantity INT,
    cost FLOAT(12),
    price FLOAT(12),
    name VARCHAR(255),
    description VARCHAR(255)
  );`);
    console.log('creating categories..');
    await client.query(`CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
  );`);
    console.log('creating itemCategories..');
    await client.query(`CREATE TABLE "itemCategories" (
    id SERIAL PRIMARY KEY,
    "itemId" INT REFERENCES items(id),
    "categoryId" INT REFERENCES categories(id)
  );`);



  }
  catch (error) {
    console.error('error creating tables...');
    throw error;
  }
}

/* 

DO NOT CHANGE ANYTHING BELOW. This is default seed data, and will help you start testing, before getting to the tests. 

*/

async function createInitialUsers() {
  console.log('Starting to create users...');
  try {

    const usersToCreate = [
      { username: 'admin', password: 'password', email: 'admin@localhost.com' },
      { username: 'sandra', password: 'sandra123', email: 'sandra@gmail.com' },
      { username: 'glamgal', password: 'glamgal123', email: 'glamgal@gmail.com' },
    ]
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    const adminUser = await updateUser({ admin: true, id: 1 });
    console.log('admin user updated: ', adminUser);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
};
async function createInitialItems() {
  console.log('Starting to create items...');
  try {

    const itemsToCreate = [
      { itemNumber: 'ITEM1', description: 'A item in the db', name: 'Item_1', cost: 1.23, price: 2.46 },
      { itemNumber: 'ITEM2', description: 'A item in the db', name: 'Item_2', cost: 1.23, price: 2.46 },
      { itemNumber: 'ITEM3', description: 'A item in the db', name: 'Item_3', cost: 1.23, price: 2.46 },
      { itemNumber: 'ITEM4', description: 'A item in the db', name: 'Item_4', cost: 1.23, price: 2.46 },
      { itemNumber: 'ITEM5', description: 'A item in the db', name: 'Item_5', cost: 1.23, price: 2.46 }
    ]
    const items = await Promise.all(itemsToCreate.map(createItem));

    console.log('Items created:');
    console.log(items);
    console.log('Finished creating items!');
  } catch (error) {
    console.error('Error creating items!');
    throw error;
  }
};

async function createInitialItems() {
  console.log('Starting to create items...');
  try {
    // itemNumber, description, name, cost, price, onHand
    const itemsToCreate = [
      { itemNumber: 'ITEM1', description: 'an item, yay', name: 'my item', cost: 1.00, price: 2.00, onHand: 5 },
      { itemNumber: 'ITEM2', description: 'an item, yay', name: 'my item', cost: 1.00, price: 2.00, onHand: 5 },
      { itemNumber: 'ITEM3', description: 'an item, yay', name: 'my item', cost: 1.00, price: 2.00, onHand: 5 },
      { itemNumber: 'ITEM4', description: 'an item, yay', name: 'my item', cost: 1.00, price: 2.00, onHand: 5 },
      { itemNumber: 'ITEM5', description: 'an item, yay', name: 'my item', cost: 1.00, price: 2.00, onHand: 5 }
    ]
    const items = await Promise.all(itemsToCreate.map(createItem));

    console.log('items created:');
    console.log(items);
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
};

async function createInitialOrders() {
  console.log('Starting to create items...');
  try {
    // itemNumber, description, name, cost, price, onHand
    const ordersToCreate = [
      { userId: 1, attn: "Jane Doe", email: "jon@doe.com", phoneNumber: '77777777', address: "a string", address2: "a string", zip: "a string", state: "a string" },
      { userId: 1, attn: "Jane Doe", email: "jon@doe.com", phoneNumber: '77777777', address: "a string", address2: "a string", zip: "a string", state: "a string" },
      { userId: 1, attn: "Jane Doe", email: "jon@doe.com", phoneNumber: '77777777', address: "a string", address2: "a string", zip: "a string", state: "a string" },
      { userId: 1, attn: "Jane Doe", email: "jon@doe.com", phoneNumber: '77777777', address: "a string", address2: "a string", zip: "a string", state: "a string" },
      { userId: 1, attn: "Jane Doe", email: "jon@doe.com", phoneNumber: '77777777', address: "a string", address2: "a string", zip: "a string", state: "a string" }
    ]
    const orders = await Promise.all(ordersToCreate.map(createOrder));

    console.log('orders created:');
    console.log(orders);
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
};

async function createInitialLineItems() {
  console.log('Starting to create LineItems...');
  try {
    // itemNumber, description, name, cost, price, onHand
    const lineItemsToCreate = [
      { itemId: '1', orderId: '1', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" },
      { itemId: '1', orderId: '1', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" },
      { itemId: '1', orderId: '1', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" },
      { itemId: '1', orderId: '1', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" },
      { itemId: '1', orderId: '1', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" },
      { itemId: '1', orderId: '2', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" },
      { itemId: '1', orderId: '2', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" },
      { itemId: '1', orderId: '2', quantity: 2, cost: 1.00, price: 2.00, name: "an item", description: "an item" }
    ];
    const lineItems = await Promise.all(lineItemsToCreate.map(createLineItem));

    console.log('lineItems created:');
    console.log(lineItems);
  } catch (error) {
    console.error('Error creating lineItems!');
    throw error;
  }
};

async function createInitialCategories() {
  console.log('Starting to create categories...');
  try {
    // itemNumber, description, name, cost, price, onHand
    const categoriesToCreate = [
      "DC UNIVERSE",
      "MARVEL UNIVERSE",
      "OTHER UNIVERSES"
    ];
    const categories = await Promise.all(categoriesToCreate.map(createCategory));

    console.log('categories created:');
    console.log(categories);
  } catch (error) {
    console.error('Error creating categories!');
    throw error;
  }
};

async function createInitialItemCategories() {
  console.log('Starting to create itemCategories...');
  try {
    // itemNumber, description, name, cost, price, onHand
    const itemCategoriesToCreate = [
      { itemId:1, categoryId:1 },
      { itemId:2, categoryId:1 },
      { itemId:3, categoryId:1 },
      { itemId:4, categoryId:3 },
      { itemId:5, categoryId:2 },
      { itemId:1, categoryId:2 },
      { itemId:2, categoryId:2 }
    ];
    const itemCategories = await Promise.all(itemCategoriesToCreate.map(createItemCategory));

    console.log('itemCategories created:');
    console.log(itemCategories);
  } catch (error) {
    console.error('Error creating itemCategories!');
    throw error;
  }
};




async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialItems();
    await createInitialOrders();
    await createInitialLineItems();
    await createInitialCategories();
    await createInitialItemCategories();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

module.exports = {
  rebuildDB
};
