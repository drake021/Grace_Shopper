const { client } = require("./client");



const createCategory = async ({name, priority}) => {

    try {

        const { rows } = await client.query(`INSERT INTO "routineActivities"(name, priority)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`, [name, priority]);

        return rows[0];
    }

    catch (error) {
        console.error('error creating activity..', error);
        throw error;
    }
}
// addActivityToRoutine({ routineId, activityId, count, duration })
// create a new routine_activity, and return it

const getRoutineActivityById = async (id) => {
    console.log('Running getRoutineActivityById ...');
    try {

        const { rows } = await client.query(`
            SELECT * FROM "routineActivities"
            WHERE id=$1;`, [id]);

        return rows[0];
    }

    catch (error) {
        console.error('error getting routineActivity by Id..', error);
        throw error;
    }
}
// getRoutineActivityById(id)
// return the routine_activity


const updateRoutineActivity = async ({ id, count, duration }) => {
    console.log('Running updateRoutineActivity ...');
    try {
        if(!count || !duration) {
            console.error(`missing count or duration for update`);
            throw 'missing count or duration for update';
        }

        const { rows } = await client.query(`
            UPDATE "routineActivities"
            SET count=$2, duration=$3
            WHERE id=$1
            RETURNING *;`, [id, count, duration]);
        return rows[0];
    }

    catch (error) {
        console.error('error updating routine activity..', error);
        throw error;
    }
}
// updateRoutineActivity({ id, count, duration })
// Find the routine with id equal to the passed in id
// Update the count or duration as necessary

const destroyRoutineActivity = async (id) => {
    console.log('Running destroyRoutineActivity ...');
    try {

        await client.query(`
            DELETE FROM "routineActivities"
            WHERE id=$1;`, [id]);
    }

    catch (error) {
        console.error('error destroying routine activity..', error);
        throw error;
    }
}
// destroyRoutineActivity(id)
// remove routine_activity from database

const getRoutineActivitiesByRoutine = async ({id}) => {
    console.log('Running getRoutineActivitiesByRoutine ...');
    try {
        const { rows } = await client.query(`
            SELECT * FROM "routineActivities"
            WHERE "routineId"=$1;`, [id]);
        return rows;
    }

    catch (error) {
        console.error('error getting routine activities by routine..', error);
        throw error;
    }
}
// getRoutineActivitiesByRoutine({ id })
// select and return an array of all routine_activity records
    

module.exports = {
    addActivityToRoutine,
    getRoutineActivityById,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
}