
const { client } = require("./client");
const bcrypt = require('bcrypt');

const createUser = async ({username, password}) => {

    try {
        const SALT_COUNT = 10;

        // const result = await bcrypt.hash(object.password, SALT_COUNT, async function (err, hashedPassword) {

        const { rows } = await client.query(`INSERT INTO users(username, password)
                VALUES ($1, $2)
                ON CONFLICT (username) DO NOTHING 
                RETURNING *;`, [username, password]);
        delete rows[0].password;
        return rows[0];
        // });
        // console.log('create user result:', result);
        // return result;
    }

    catch (error) {
        console.error('error creating user..', error);
        throw error;
    }
}

const getUser = async ({ username, password }) => {
    console.log('running getUser..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;`, [username]);
        console.log('looking at user: ', rows[0]);
        //this if block not passing correctly for some reason..
        if (rows[0].password == password) {
            delete rows[0].password;
            return rows[0];
        } else {
            throw `passwords do not match...`;
        }

    }

    catch (error) {
        console.error('error getting User w/ password check..', error);
        throw error;
    }
}
// getUser({ username, password })
// this should be able to verify the password against the hashed password


const getUserById = async (id) => {
    console.log('running getUserById..');
    try {

        const { rows } = await client.query(`
            SELECT username, id FROM users
            WHERE id=$1;`, [id]);

        return rows[0];
    }

    catch (error) {
        console.error('error getting user by Id..', error);
        throw error;
    }
}
// select a user using the user's ID. Return the user object.
// do NOT return the password

const getUserByUsername = async (username) => {
    console.log('running getUserByUsername..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;`, [username]);

        return rows[0];
    }

    catch (error) {
        console.error('error getting user by Username..', error);
        throw error;
    }
}
// getUserByUsername(username)
// select a user using the user's username. Return the user object.

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
}