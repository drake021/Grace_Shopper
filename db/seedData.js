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
      { itemNumber: 'ITEM1', description: 'Soaring through the skies above a swirling cloud base, the Power Girl Premium Format Figure measures 25” tall. She poses powerfully here, flexing her muscles in a moment of calm between battles.', name: 'Power Girl, cost: 1.23, price: 350 },
      { itemNumber: 'ITEM2', description: 'Going back to the origins of our favorite superheroes, Hot Toys is bringing The Origins Collection which takes inspiration from the pages of classic Marvel Comics', name: 'Iron Man', cost: 1.23, price: 247 },
      { itemNumber: 'ITEM3', description: 'Famous for his superhuman strength and indestructible shield, Steve Rogers finds himself called into action to complete a mission with the universe’s entire existence on the line.', name: 'Captain America', cost: 1.23, price: 320 },
      { itemNumber: 'ITEM4', description: 'The Superman: The Movie Figure measures 20.5” tall, lovingly crafted in the iconic likeness of actor Christopher Reeve as Superman. His portrait features stunning blue eyes, and the signature kiss curl in his hair.', name: 'Superman', cost: 1.23, price: 417 },
      { itemNumber: 'ITEM5', description: 'The Batmobile is on its way to fight crime in Gotham City! As one of the iconic bat gadgets, the technologically advanced Batmobile is a heavily armored tactical assault vehicle in Batman’s arsenal.', name: 'Batmobile', cost: 1.23, price: 532 },
      { itemNumber: 'ITEM6', description: 'The Galactus Maquette stands 26” tall, towering over an annihilated city landscape where buildings melt beneath his boots as he wields the fiery force of the Power Cosmic.', name: 'Galactus', cost: 1.23, price: 180 },
      { itemNumber: 'ITEM7', description: 'The war between Avengers and villainous Thanos is here in Avengers: Infinity War. Superheroes will join forces to fight Thanos, while the fate of the Earth and the Universe lays in the balance!', name: 'Thor', cost: 1.23, price: 360 },
      { itemNumber: 'ITEM8', description: 'In Spider-Man: Far From Home, Peter Parker plans to leave super heroics behind for a few weeks with his friends for a vacation in Europe, but several creature attacks are plaguing the continent.', name: 'Spider-Man', cost: 1.23, price: 140 },
      { itemNumber: 'ITEM9', description: 'Vision is aware of the full trauma Wanda experienced in Avengers: Infinity War, having killed him to prevent Thanos from getting the Mind Stone, but heartbroken to watch him sacrificed again after the warlord revised time.', name: 'Vision', cost: 1.23, price: 370 },
      { itemNumber: 'ITEM10', description: 'Commemorating Stan Lee memorable cameo appearance in Thor: Ragnarok, Sideshow and Hot Toys present a highly-detailed sixth scale Stan Lee® collectible figure as one of the 2020 Toy Fair Exclusive items only available in selected markets!', name: 'Stan Lee', cost: 1.23, price: 420 },
      { itemNumber: 'ITEM11', description: 'You’ve heard of a derby jammer- now get ready for a derby HAMMER! The Harley Quinn Figure measures 20” tall as Gotham’s maid of mischief skates her way around a neon-themed rink base, ready to take a swing at any chuckleheads who get in her way.', name: 'Harley Quinn', cost: 1.23, price: 320 },
      { itemNumber: 'ITEM12', description: 'A item in the dbInspired by her classic appearance in Marvel Comics, the polyresin Scarlet Witch Premium Format Figure features a fully sculpted red and pink bodysuit, complete with red boots and gloves exuding chaos magic tendrils.', name: 'Scarlet Witch', cost: 1.23, price: 340 },
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
      { itemNumber: 'ITEM5', description: 'an item, yay', name: 'my item', cost: 1.00, price: 2.00, onHand: 5 },
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
