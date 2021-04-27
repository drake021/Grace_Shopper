
const { client } = require("./client");
const bcrypt = require('bcrypt');
const { testFirstRow } = require("./api");

const createUser = async ({ username, password, email, firstName, lastName, phoneNumber, address, address2, zip, state }) => {

    try {
        // const SALT_COUNT = 10;

        const { rows } = await client.query(`INSERT INTO users(username, password, email, "firstName", "lastName", "phoneNumber", address, address2, zip, state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (username) DO NOTHING 
                RETURNING *;`, [username, password, email, firstName, lastName, phoneNumber, address, address2, zip, state]);
                testFirstRow(rows);
        delete rows[0].password;
        return rows[0];
        //Would also like to do nothing on conflict with email; but haven't figured out how to work it.
        // could just write code to compare new entry to db
    }

    catch (error) {
        console.error('error creating user..', error);
        throw error;
    }
};
//this function updates a user row by id
const updateUser = async ({ id, admin, firstName, lastName, email, phoneNumber, address, address2, zip, state }) => {
    let dynamicArray = [];
    let dynamicArrayNames = [];
    const verifyValue = (value, type = 'string', name) => {
        if (type === null) { type = 'string'};
        if (typeof (value) === type) {
            dynamicArray.push(value);
            dynamicArrayNames.push(name);
        }
    };
    const _ = null;
    const getQueryValuesString = () => {
        let queryValuesString = `SET `;
        verifyValue(admin, 'boolean', 'admin');
        verifyValue(firstName, _, '"firstName"');
        verifyValue(lastName, _, '"lastName"');
        verifyValue(firstName, _, '"firstName"');
        verifyValue(email, _, 'email');
        verifyValue(phoneNumber, _, 'phoneNumber');
        verifyValue(address, _, 'address');
        verifyValue(address2, _, 'address2');
        verifyValue(zip, _, 'zip');
        verifyValue(state, _, 'state');
        if (dynamicArray.length < 1) {
            throw { name: 'error_noInputValues', message: 'missing input values for database' }
        }
        queryValuesString = queryValuesString + `${dynamicArrayNames[0]}=$1`;

        if (dynamicArray.length > 1) {
            for (let i = 1; dynamicArray.length > i; i++) {
                queryValuesString = queryValuesString + `, ${dynamicArrayNames[i]}=$${i + 1}`;
            }
        }
        dynamicArray.push(id);

        return queryValuesString;
    };

    try {
        //if there are no values passed in except token and id; this should error out as no values provided
        const queryValuesString = getQueryValuesString();
        // console.log('queryString: ', queryValuesString);
        const { rows } = await client.query(`
        UPDATE users
        ${queryValuesString}
        WHERE id=$${dynamicArray.length}
        RETURNING *;`, dynamicArray);
        testFirstRow(rows);
        return rows[0];
        // returns user object of updated row (not password);
    }
    catch (error) {
        console.error('updateUser failed...', error);
        throw error;
    }
};




//for logging in
const loginUser = async ({ username, password }) => {
    console.log('running getUser..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;`, [username]);
        testFirstRow(rows);
        if (rows[0].password === password) {
            delete rows[0].password;
            return rows[0];
        } else {
            throw { name: 'PASSWORD_FAIL', message: 'Password is incorrect' };
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
        testFirstRow(rows);
        // if (!rows[0]) {
        //     throw { name: "userNotExist", message: "Username does not exist" }
        // }

        return rows[0];
    }

    catch (error) {
        console.error('error getting user by Username..', error);
        throw error;
    }
};

const getUserById = async (id) => {
    console.log('running getUserById..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE id=$1;`, [id]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error getting user by id..', error);
        throw error;
    }
};

const getAllUsers = async () => {
    console.log('running getUserById..');
    try {

        const { rows } = await client.query(`
            SELECT * FROM users;`);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error getAllUsers..', error);
        throw error;
    }
};



module.exports = {
    createUser,
    loginUser,
    getUserByUsername,
    getUserById,
    updateUser,
    getAllUsers
}