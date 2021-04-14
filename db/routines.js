const { client } = require("./client");

// const routinesToCreate = [
//     { creatorId: 2, isPublic: false, name: 'Bicep Day', goal: 'Work the Back and Biceps.' },
//     { creatorId: 1, isPublic: true, name: 'Chest Day', goal: 'To beef up the Chest and Triceps!' },
//     { creatorId: 1, isPublic: false, name: 'Leg Day', goal: 'Running, stairs, squats' },
//     { creatorId: 2, isPublic: true, name: 'Cardio Day', goal: 'Running, stairs. Stuff that gets your heart pumping!' },
//   ]

const createRoutine = async ({ creatorId, isPublic, name, goal }) => {

    // createRoutine({ creatorId, isPublic, name, goal })
    // create and return the new routine
    try {

        const { rows } = await client.query(`INSERT INTO routines("creatorId", "isPublic", name, goal)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (name) DO NOTHING 
                RETURNING *;`, [creatorId, isPublic, name, goal]);
                console.log('create routine result: ', rows[0]);

        return rows[0];
    }

    catch (error) {
        console.error('error creating routine..', error);
        throw error;
    }
}


const getRoutineById = async (id) => {
    try {
        const { rows } = await client.query(`SELECT * FROM routines WHERE id='$1';`, [id]);
        return rows[0];
    }
    catch (error) {
        throw error;
    }

}
// getRoutineById(id)
// return the routine
const getRoutinesWithoutActivities = async () => {
    try {
        const { rows } = await client.query(`
            SELECT *, users.username AS "creatorName"
            FROM routines
            INNER JOIN users ON users.id=routines."creatorId";`);

            // SELECT * FROM routines;
            // SELECT username as "creatorName"
            // FROM users
            // WHERE id=routines.creatorId;

// SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
// FROM Orders
// INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
        console.log('result from getRoutinesWithoutActivities: ', rows);
        return rows;
    }
    catch (error) {
        throw error;
    }
}

// select and return an array of all routines


const getAllRoutines = async () => {
    console.log('running getAllRoutines..');
    try {
        const routinesWithoutActivities = await getRoutinesWithoutActivities();
        const { rows } = await client.query(`
        SELECT * FROM "routineActivities";`);

        const result = routinesWithoutActivities.map(routine => {
            const result = { ...routine };
            result.activities = [];

            rows.forEach(routineActivity => {

                if (routine.id === routineActivity.routineId) {

                    result.activities.push(routineActivity);
                    //what I really want to do here is convert the activityId into an activity object
                }
            });
            return result

        });

        return result;
    }
    catch (error) {
        console.error('error in getAllRoutines: ', error);
        throw error;
    }
}
// select and return an array of all routines, include their activities

const getAllPublicRoutines = async () => {
    console.log('running getAllPublicRoutines ...');
    try {
        const allRoutines = await getAllRoutines();
        let result = [];
        //reduce function???
        allRoutines.forEach(object => {
            if (object.isPublic) {
                result.push(object);
            }
        });
        return result;
    }
    catch (error) {
        console.error('error in Getting All Public Routines...', error);
        throw error;
    }
}
// select and return an array of public routines, include their activities

const getAllRoutinesByUser = async ({ username }) => {
    console.log('running getAllRoutinesByUser ...');
    //Okay... so it's at this point where you realise you should probably make new SQL commands for these functions... but shortcuts
    try {
        const allRoutines = await getAllRoutines();
        let result = [];
        //reduce function???
        allRoutines.forEach(object => {
            if (object.username === username) {
                result.push(object);
            }
        });
        return result;
    }
    catch (error) {
        console.error('error in Getting All Routines by User...', error);
        throw error;
    }
}
// getAllRoutinesByUser({ username })
// select and return an array of all routines made by user, include their activities
const getPublicRoutinesByUser = async ({ username }) => {
    console.log('running getPublicRoutinesByUser ...');
    try {
        const allRoutines = await getAllRoutines();
        let result = [];
        //reduce function???
        allRoutines.forEach(object => {
            if (object.username === username && object.isPublic) {
                result.push(object);
            }
        });
        return result;
    }
    catch (error) {
        console.error('error in Getting All Public Routines by User...', error);
        throw error;
    }
}
// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities

const getPublicRoutinesByActivity = async ({ id }) => {
    console.log('running getPublicRoutinesByActivitiy ...');
    try {
        const allRoutines = await getAllRoutines();
        let result = [];
        //reduce function???
        allRoutines.forEach(object => {
            if (object.isPublic) {
                //reduce????
                //this next line is qustionable
                if (object.activities.filter( activity => { activity.id === id })) {
                    result.push(object);
                }
            }
        });
        return result;
    }
    catch (error) {
        console.error('error in Getting All Routines by Activity...', error);
        throw error;
    }
}
// getPublicRoutinesByActivity({ id })
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities


const updateRoutine = async ({ id, isPublic, name, goal }) => {
    console.log('running updateRoutine ...');
    //need to NOT update the values that are not passed in..
    try {
        const {rows} = await client.query(`
        UPDATE routines
        SET "isPublic"=$1, name=$2, goal=$3
        WHERE id=$4
        RETURNING *;`, [isPublic, name, goal, id]);
        console.log('updateRoutine result: ', rows[0]);
        return rows[0];
    }
    catch (error) {
        console.error('updateRoutine failed...', error);
        throw error;
    }
}
// updateRoutine({ id, isPublic, name, goal })
// Find the routine with id equal to the passed in id
// Don't update the routine id, but do update the isPublic status, name, or goal, as necessary
// Return the updated routine
const destroyRoutine = async (id) => {
    console.log('running destroyRoutine ...');
    try {
        await client.query(`
            DELETE FROM "routineActivities"
            WHERE "routineId"=$1;`, [id]);
        await client.query(`
            DELETE FROM routines
            WHERE id=$1;`, [id]);
    }
    catch (error) {
        console.error('updateRoutine failed...', error);
        throw error;
    }
}
// destroyRoutine(id)
// remove routine from database
// Make sure to delete all the routine_activities whose routine is the one being deleted.



module.exports = {
    createRoutine,
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    destroyRoutine
}