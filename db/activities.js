

const { client } = require("./client");

const createActivity = async (object) => {
    console.log('running createActivity ..');
    try {

        const { rows } = await client.query(`INSERT INTO activities(name, description)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING 
                RETURNING *;`, [object.name, object.description]);

        return rows[0];
    }

    catch (error) {
        console.error('error creating activity..', error);
        throw error;
    }
}

const getActivityById = async (id) => {
    console.log('running getActivityById ..');
    try {

        const { rows } = await client.query(`SELECT * FROM activities WHERE id=$1;`, [id]);

        return rows[0];
    }

    catch (error) {
        console.error('error getting activity by Id..', error);
        throw error;
    }
}
// getActivityById(id)
// return the activity

const getAllActivities = async () => {
    console.log('running getAllActivities ..');
    try {
        const { rows } = await client.query(`SELECT * from activities;`);
        return rows;
    }
    catch (error) {
        console.error('error getting all activities..');
        throw error;
    }
}
// select and return an array of all activities

const updateActivity = async ({ id, name, description }) => {
    console.log('running updateActivity ..');

    try {

        const { rows } = await client.query(`
            UPDATE activities
            SET name=$1, description=$2
            WHERE id=$3
            RETURNING *;`, [name, description, id]);
        console.log('returned row from updating activity: ', rows[0]);
        

        return rows[0];
    }

    catch (error) {
        console.error('error updatingActivity..', error);
        throw error;
    }
}
// updateActivity({ id, name, description })
// don't try to update the id
// do update the name and description
// return the updated activity

module.exports = {
    createActivity,
    getActivityById,
    getAllActivities,
    updateActivity
}