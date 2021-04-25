const testDotenv = require('dotenv').config();
if (testDotenv.error) { console.log(testDotenv.error) }
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const { createUser, loginUser, client, getUserByUsername, updateUser,
    createOrder, createLineItem, deleteOrder, getItemCategoriesByItem,
    getCategoriesById, getAllItems, getItemById, updateItem,
    removeItem, attachLineItem, getLineItemsByOrder, removeLineItem,
    createCategory, getAllCategories, removeCategory, getItemCategoriesByCategory,
    removeItemCategory, createItemCategory } = require('./db');

// create the express server here

const PORT = 3000;
const express = require('express');
const server = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const orders = require('./db/orders');


server.use(cors());
server.use(morgan('dev'));
server.use(bodyParser.json());

const apiRouter = express.Router();
const usersRouter = express.Router();
const ordersRouter = express.Router();
const itemsRouter = express.Router();
const lineItemsRouter = express.Router();
const categoriesRouter = express.Router();
const itemCategoriesRouter = express.Router();

server.use('/api', apiRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/items', itemsRouter);
apiRouter.use('/lineItems', lineItemsRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/itemCategories', itemCategoriesRouter);

client.connect();


// ***helper functions***
function requireUsername(req, res, next) {

    if (!req.body.username) {
        next({
            name: "MissingUserNameError",
            message: "You must provide a valid username."
        });
    }


    next();
};
function requirePassword(req, res, next) {
    if (!req.body.password) {
        next({
            name: "MissingPasswordError",
            message: "You must provide a valid password."
        });
    } else if (req.body.password.length < 8) {
        next({
            name: "PasswordNotLongEnough",
            message: "You must provide a password atleast 8 characters long."
        });
    }
    next();
};


const verifyToken = async (req, res, next) => {
    console.log('running token check function...');
    const prefix = 'Bearer ';
    const auth = req.header('authorization');

    if (!auth) { // nothing to see here
        console.log('auth is missing!!')
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {

            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch ({ name, message }) {
            next({ name, message });
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
};
const respError = (name, message) => {
    return {
        name: `error_${name}`,
        message,
        error: message
    };
};

// *** templates ***

// usersRouter.get('', requireUsername, requirePassword, verifyToken, async (req, res, next) => {

//     if ( !req.user.admin) {
//         throw {
//             name: 'error_requireAdmin', 
//             error: 'must use token of admin user', 
//             message: 'must use token of admin user'
//         };
//     };
//     const { username, password } = req.body;

//     try {

//         const result = await DBFUNCTION({ username, password });

//         res.send(result);
//         next();
//     }
//     catch ({ name, message }) {
//         next({ name, message })
//     }

// });

///////////////////////////////

server.listen(PORT, () => {
    console.log('The server is up on port', PORT);
});

apiRouter.get('/health', (req, res, next) => {
    console.log('The server is up and healthy on port', PORT);

    res.send({ message: 'server is up and healthy!!!' });
});


// ***users***
// POST /users/register
// Create a new user. Require username and password, and hash password before saving user to DB. Require all passwords to be at least 8 characters long.

usersRouter.post('/register', async (req, res, next) => {
    const { username, password, admin, firstName, lastName, email, phoneNumber, address, address2, zip, state } = req.body;

    try {

        const _user = await getUserByUsername(username);

        if (_user) {
            next({ name: 'userExistsError', message: 'A user by that name already exists' });
        };
        const user = await createUser({ username, password, admin, firstName, lastName, email, phoneNumber, address, address2, zip, state });
        const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '1w' });
        res.send({ message: 'register user success!', user, token });
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }
});

// Throw errors for duplicate username, or password-too-short.

//POST /api/users/login
usersRouter.post('/login', requireUsername, requirePassword, async (req, res, next) => {

    const { username, password } = req.body;

    try {

        const user = await loginUser({ username, password });

        const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '1w' });

        res.send({ message: 'Login user success!', user, token });
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// GET /api/users (**Admin)
//returns all users but without passwords

usersRouter.get('', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };

    try {

        const users = await getAllUsers();
        if (users.length < 1) {
            throw {
                name: 'error_noRows',
                error: 'no rows were returned from getAllUsers query',
                message: 'no rows were returned from getAllUsers query'
            };
        }

        res.send(users);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// PATCH /api/users/:userId
//updated user row **admin** or **owner**

usersRouter.patch('/:userId', verifyToken, async (req, res, next) => {

    if (!req.user) {
        throw {
            name: 'error_requireToken',
            error: 'must provide a BEARER token',
            message: 'must provide a BEARER token'
        };
    }

    const id = req.params.userId;

    if (!req.user.admin) {
        //user is not admin; so if he owner of user?
        if (req.user.id !== id) {
            throw {
                name: 'error_requireAdmin',
                error: 'must use token of admin user',
                message: 'must use token of admin user'
            };
        };
    };

    const { admin, firstName, lastName, email, phoneNumber, address, address2, zip, state } = req.body;

    try {

        const updatedUser = await updateUser({ id, admin, firstName, lastName, email, phoneNumber, address, address2, zip, state });


        res.send({ message: 'Update user success!', updatedUser });
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }
});

// *** Orders *** */

//POST api/orders (optional token)
//creates a new Order; if token provided then assign creator id
//pass in optional "lineItems" array to have line items added to new order.
ordersRouter.post('', verifyToken, async (req, res, next) => {
    const { attn, email, phoneNumber, address, address2, zip, state, lineItems } = req.body;
    if (!!req.user) {
        const userId = req.user.id;
    }

    try {

        const newOrder = await createOrder({ userId, attn, email, phoneNumber, address, address2, zip, state });

        // 
        if (!lineItems || !Array.isArray(lineItems)) {
            res.send(newOrder);
            next();
        } else {
            // if there are line items...
            const newLineItems = [];
            lineItems.forEach(async lineItem => {
                const newLineItem = await createLineItem(lineItem);
                newLineItems.push(newLineItem);
            });
            newOrder.lineItems = newLineItems;
            res.send(newOrder);
            next();
        }

        res.send({ message: 'create order success!', newOrder });
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }
});

//PATCH api/orders/:orderId (admin command?)

ordersRouter.patch('/:orderId', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };
    const id = Number(req.params.orderId);
    //should test this
    if (typeof (id) !== 'number') {
        throw {
            name: 'error_OrderId',
            error: 'orderId not supplied',
            message: 'orderId not supplied'
        }
    };

    const { attn, email, phoneNumber, address, address2, zip, state } = req.body;

    try {

        const updatedOrder = await updateOrder({ id, attn, email, phoneNumber, address, address2, zip, state });

        res.send(updatedOrder);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//DELETE api/orders/:orderId (**admin**)

ordersRouter.delete('/:orderId', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };
    const id = Number(req.params.orderId);
    if (typeof (id) !== "number") {
        throw {
            name: "error_orderId",
            message: "orderId input invalid",
            error: "orderId input invalid"
        };
    };


    try {

        const data = await deleteOrder(id);

        // Could be a usefil update i guess?
        // res.send({
        //     success: true,
        //     message: `order id ${id} deleted`,
        //     data
        // });
        res.send({ data });
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// *** Items ***

//POST api/items (**admin**)
//creates a new item for the item DB; requires a token from an admin user

itemsRouter.post('', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };
    const { itemNumber, description, name, cost, price } = req.body;
    // requires all fields
    if (typeof (itemNumber) !== 'string') {
        throw respError('itemNumber', 'itemNumber is missing or invalid');
    }
    if (typeof (description) !== 'string' || typeof (name) !== 'string' ||
        typeof (cost) !== 'number' || typeof (price) !== 'number') {
        throw respError('missingData', 'body is missing required values');
    }
    try {

        const result = await createItem({ itemNumber, description, name, cost, price });

        res.send(result);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//GET api/items (public)
//returns array of all item objects
//only returns cost if admin token is used

itemsRouter.get('', verifyToken, async (req, res, next) => {
    //includes categories

    const attachCategories = (isAdmin = false) => {
        if (!isAdmin) {
            return async (item) => {
                delete item.cost;
                const itemCategories = await getItemCategoriesByItem(item.id);
                const categories = itemCategories.map(async itemCategory => {
                    return await getCategoriesById(itemCategory.categoryId);
                });
                item.categories = categories;
                return item;
            }
            return async (item) => {
                const itemCategories = await getItemCategoriesByItem(item.id);
                const categories = itemCategories.map(async itemCategory => {
                    return await getCategoriesById(itemCategory.categoryId);
                });
                item.categories = categories;
                return item;
            }
        }
    };

    try {

        const allItemsWithoutCategories = await getAllItems();
        //Should work!
        const allItemsWithCategories = allItemsWithoutCategories.map(attachCategories(req.user.admin));
        res.send(allItemsWithCategories);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//GET api/items/:itemId (public command)
//returns item object
//only return cost if admin token is passed in

itemsRouter.get('/:itemId', verifyToken, async (req, res, next) => {

    const { itemId } = req.params;

    try {
        const item = await getItemById(itemId);
        if (!req.user.admin) {
            delete item.cost
        };
        res.send(item);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// PATCH api/items/:itemId (**admin**)
//updates an item in the DB

itemsRouter.patch('/:itemId', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };
    const itemId = Number(req.params.itemId);
    //edge case: NaN id passed through
    if (typeof (itemId) !== 'number') {
        respError('itemId_invalid', 'itemId is missing or invalid');
    };

    try {

        const updatedItem = await updateItem(itemId);
        res.send(updatedItem);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//DELETE api/items/:itemId (**admin**)
//deletes item from DB and all associated line items

itemsRouter.delete('/:itemId', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };
    const itemId = Number(req.params.itemId);
    if (typeof (itemId) !== 'number' || itemId === NaN) {
        throw respError('itemId_invalid', 'itemId is missing or invalid');
    }
    try {
        const data = await removeItem(itemId);
        res.send(data);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// *** Line Items ***

//POST api/lineItems
//creates a new lineItem for the lineItems DB;

lineItemsRouter.post('', verifyToken, async (req, res, next) => {

    // if ( !req.user.admin) {
    //     throw {
    //         name: 'error_requireAdmin', 
    //         error: 'must use token of admin user', 
    //         message: 'must use token of admin user'
    //     };
    // };
    const quantity = Math.floor(req.body.quantity);
    const { orderId, itemId, cost, price, name, description } = req.body;
    //I'm thinking we can pass an item object with quantity, itemId, and orderId added to the object
    if (typeof (orderId) !== 'number' || typeof (itemId) !== 'number' || typeof (quantity) !== 'number' ||
        typeof (cost) !== 'number' || typeof (price) !== 'number' || typeof (name) !== 'string' || typeof (description) !== 'string') {
        throw respError('invalid_data', 'data provided in body is invalid or missing')
    }

    try {

        const lineItem = await attachLineItem({ orderId, itemId, quantity, cost, price, name, description });

        res.send(lineItem);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//GET api/lineItems/:orderId (public) (*userToken or *admin token) ()
//returns array of all lineItem objects by orderId
//only returns cost if admin token is used

lineItemsRouter.get('/:orderId', verifyToken, async (req, res, next) => {

    if (!req.user) {
        throw respError('invalid_token', 'must provide an auth token');
    };
    const orderId = Number(req.params.orderId);
    if (typeof (orderId) !== 'number' || orderId === NaN) {
        throw respError('invalid_orderId', 'orderId missing or invalid');
    }

    try {

        const lineItems = await getLineItemsByOrder(orderId);
        if (!lineItems || lineItems.length < 1) {
            throw respError('error_notFound', 'could not locate lineItems for that id')
        }

        res.send(lineItems);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// PATCH api/lineItems/:lineItemId (**admin**)
//updates a lineItem in the DB

lineItemsRouter.patch('/:lineItemId', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };

    const lineItemId = Math.floor(Number(req.params.lineItemId));
    if (typeof (lineItemId) !== 'number' || lineItemId === NaN) {
        respError('invalid_lineItemId', 'lineItemId is missing or invalid')
    }

    const quantity = Math.floor(req.body.quantity);
    const { cost, price, name, description } = req.body;

    if (typeof (quantity) !== 'number' || typeof (cost) !== 'number' || typeof (price) !== 'number' ||
        typeof (name) !== 'string' || typeof (description) !== 'string') {
        throw respError('invalid_data', 'data provided in body is invalid or missing')
    }
    try {

        const updatedLineItem = await updateLineItem({ lineItemId, quantity, cost, price, name, description });

        res.send(updatedLineItem);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//DELETE api/lineItems/:lineItemId (**admin**)
//deletes lineItem from DB

lineItemsRouter.delete('/:lineItemId', verifyToken, async (req, res, next) => {

    if (!req.user.admin) {
        throw {
            name: 'error_requireAdmin',
            error: 'must use token of admin user',
            message: 'must use token of admin user'
        };
    };


    try {

        const lineItemId = Math.floor(Number(req.params.lineItemId));
        if (typeof (lineItemId) !== 'number' || lineItemId === NaN) {
            respError('invalid_lineItemId', 'lineItemId is missing or invalid')
        }
        const data = await removeLineItem({ username, password });

        res.send(data);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// *** Categories ***

//POST api/categories (**admin**)
//creates a new category for the categories DB; requires a token from an admin user

categoriesRouter.post('', verifyToken, async (req, res, next) => {

    if ( !req.user.admin) {
        throw {
            name: 'error_requireAdmin', 
            error: 'must use token of admin user', 
            message: 'must use token of admin user'
        };
    };
    const { name } = req.body;

    try {

        const category = await createCategory(name);

        res.send(category);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//GET api/categories (public)
//returns array of all categories

categoriesRouter.get('', async (req, res, next) => {

    try {

        const categories = await getAllCategories();

        res.send(categories);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//GET api/categories/:categoryId (public command) ***Don't think this is needed, save for last ***
//returns item object
//only return cost if admin token is passed in

// categoriesRouter.get('', verifyToken, async (req, res, next) => {

//     if ( !req.user.admin) {
//         throw {
//             name: 'error_requireAdmin', 
//             error: 'must use token of admin user', 
//             message: 'must use token of admin user'
//         };
//     };
//     const { username, password } = req.body;

//     try {

//         const result = await DBFUNCTION({ username, password });

//         res.send(result);
//         next();
//     }
//     catch ({ name, message }) {
//         next({ name, message })
//     }

// });

// PATCH api/categories/:categoryId (**admin**)
//updates a category in the DB

categoriesRouter.patch('/:categoryId', verifyToken, async (req, res, next) => {

    if ( !req.user.admin) {
        throw {
            name: 'error_requireAdmin', 
            error: 'must use token of admin user', 
            message: 'must use token of admin user'
        };
    };
    const id = Math.floor(Number(req.params.categoryId));
    if (typeof (id) !== 'number' || id === NaN) {
        respError('invalid_categoryId', 'categoryId is missing or invalid')
    }

    try {

        const updatedCategory = await updateCategory({id, name});

        res.send(updatedCategory);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//DELETE api/categories/:categoryId (**admin**)
//deletes category from DB and all associated itemCategories

categoriesRouter.delete('/:categoryId', verifyToken, async (req, res, next) => {

    if ( !req.user.admin) {
        throw {
            name: 'error_requireAdmin', 
            error: 'must use token of admin user', 
            message: 'must use token of admin user'
        };
    };
    const id = Math.floor(Number(req.params.categoryId));
    if (typeof (id) !== 'number' || id === NaN) {
        respError('invalid_categoryId', 'categoryId is missing or invalid')
    }

    try {

        const itemCategories = await getItemCategoriesByCategory(id);

        itemCategories.forEach( async itemCategory => {
            await removeItemCategory(itemCategory.id);
        });

        const data = await removeCategory(id);
        data.itemCategories = itemCategories;
        res.send(data);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

// *** itemCategories ***

//POST api/itemCategories (**admin**)
//creates a new category for the categories DB; requires a token from an admin user

itemCategoriesRouter.post('', verifyToken, async (req, res, next) => {

    if ( !req.user.admin) {
        throw {
            name: 'error_requireAdmin', 
            error: 'must use token of admin user', 
            message: 'must use token of admin user'
        };
    };
    const { itemId, categoryId } = req.body;
    if (typeof (itemId) !== 'number' || itemId === NaN || typeof (categoryId) !== 'number' || categoryId === NaN) {
        respError('invalid_data', 'data is missing or invalid')
    }

    try {

        const itemCategory = await createItemCategory({ itemId, categoryId });

        res.send(itemCategory);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//GET api/itemCategories/item/:itemId (public)
//returns array of all itemCategories for item by item id

itemCategoriesRouter.get('/:itemId', async (req, res, next) => {

    const itemId = Math.floor(Number(req.params.itemId));
    if (typeof (itemId) !== 'number' || itemId === NaN) {
        respError('invalid_itemId', 'itemId is missing or invalid')
    }
    try {

        const itemCategories = await getItemCategoriesByItem(itemId);

        res.send(itemCategories);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});

//GET api/itemCategories/category/:categoryId (public)
//returns array of all itemCategories for item by category id

itemCategoriesRouter.get('/:categoryId', async (req, res, next) => {

    const categoryId = Math.floor(Number(req.params.categoryId));
    if (typeof (categoryId) !== 'number' || categoryId === NaN) {
        respError('invalid_categoryId', 'categoryId is missing or invalid')
    }
    try {

        const itemCategories = await getItemCategoriesByCategory(categoryId);

        res.send(itemCategories);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});


// PATCH api/itemCategories/:itemId (**admin**) *** As of now don't need this ***
//updates a itemCategory in the DB

// itemCategoriesRouter.patch('', verifyToken, async (req, res, next) => {

//     if ( !req.user.admin) {
//         throw {
//             name: 'error_requireAdmin', 
//             error: 'must use token of admin user', 
//             message: 'must use token of admin user'
//         };
//     };
//     const { username, password } = req.body;

//     try {

//         const result = await DBFUNCTION({ username, password });

//         res.send(result);
//         next();
//     }
//     catch ({ name, message }) {
//         next({ name, message })
//     }

// });

//DELETE api/itemCategories/:itemCategoryId (**admin**)
//deletes itemCategory from DB

itemCategoriesRouter.delete('/:itemCategoryId', verifyToken, async (req, res, next) => {

    if ( !req.user.admin) {
        throw {
            name: 'error_requireAdmin', 
            error: 'must use token of admin user', 
            message: 'must use token of admin user'
        };
    };
    const itemCategoryId = Math.floor(Number(req.params.itemCategoryId));
    if (typeof (itemCategoryId) !== 'number' || itemCategoryId === NaN) {
        respError('invalid_itemCategoryId', 'itemCategoryId is missing or invalid')
    }

    try {

        const data = await removeItemCategory(itemCategoryId);

        res.send(data);
        next();
    }
    catch ({ name, message }) {
        next({ name, message })
    }

});


apiRouter.use((error, req, res, next) => {
    res.send(error);
});

module.exports = {
    server,
    apiRouter
}
// *** Notes ***
//make sure id and other number types are checked against NaN
//floor integers
//more error handling?
//can write more helper functions for similar code to condense 