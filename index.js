const testDotenv = require('dotenv').config();
if (testDotenv.error) { console.log(testDotenv.error) }
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// const { createUser, getUserByUsername, client, getUser, getUserById,
//     getAllPublicRoutines, getAllRoutinesByUser, getAllActivities,
//     createActivity, getPublicRoutinesByActivity, createRoutine,
//     updateRoutine, destroyRoutine, updateRoutineActivity,
//     addActivityToRoutine, destroyRoutineActivity, getRoutineById,
//     getRoutineActivityById } = require('./db');

const { createUser, loginUser, client, getUserByUsername, updateUser } = require('./db');

// create the express server here

const PORT = 3000;
const express = require('express');
const server = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');


server.use(cors());
server.use(morgan('dev'));
server.use(bodyParser.json());

const apiRouter = express.Router();
const usersRouter = express.Router();

server.use('/api', apiRouter);
apiRouter.use('/users', usersRouter);

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

//////////
server.listen(PORT, () => {
    console.log('The server is up on port', PORT);
});


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

usersRouter.post('/update', verifyToken, async (req, res, next) => {
    try {

        const updatedUser = await updateUser({ id, admin, firstName, lastName, email, phoneNumber, address, address2, zip, state });


        res.send({ message: 'Update user success!', updatedUser });
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