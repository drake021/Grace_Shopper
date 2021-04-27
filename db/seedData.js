// require in the database adapter functions as you write them (createUser, createActivity...)
// const { } = require('./');
const { client } = require('./client');
// console.log('client is this in seedDate: ', client);
const { 
  createUser,
  updateUser
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
    name VARCHAR(255) UNIQUE NOT NULL,
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
    "orderId" INT REFERENCES orders(id),
    "itemId" INT REFERENCES items(id),
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
    const adminUser = await updateUser({admin: true, id: 1});
    console.log('admin user updated: ', adminUser);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
};


async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

module.exports = {
  rebuildDB
};
