
const { client } = require("./client");
const bcrypt = require('bcrypt');

const createUser = async ({username, password, email, firstName, lastName, phoneNumber, address, address2, zip, state}) => {

    try {
        const SALT_COUNT = 10;

        const { rows } = await client.query(`INSERT INTO users(username, password, email, "firstName", "lastName", "phoneNumber", address, address2, zip, state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (username, email) DO NOTHING 
                RETURNING *;`, [username, password, email, firstName, lastName, phoneNumber, address, address2, zip, state]);
        delete rows[0].password;
        return rows[0];
    }

    catch (error) {
        console.error('error creating user..', error);
        throw error;
    }
};
//this function updates a user row by id
const updateUser = ({id, password, admin, firstName, lastName, email, phoneNumber, address, address2, zip, state}) => {

    // returns user object of updated row (not password)
};
//this function deletes a user
const deleteUser = ({id}) => {

    //returns nothing or success message
}

//for logging in
const loginUser = async ({ username, password }) => {
    console.log('running getUser..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;`, [username]);
        console.log('looking at user: ', rows[0]);
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
};
//this function lets you read the data of a user (hide password)
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
};



module.exports = {
    createUser,
    loginUser,
    getUserByUsername
}