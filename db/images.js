const { client } = require("./client");
const { testFirstRow, respError } = require("./api");

const createImage = async ({ name, blob, url }) => {
    if ( typeof(name) !== 'string' || typeof(blob) !== 'string' ||  typeof(url) !== 'string' ) {
        throw respError('missingParam', 'missing input values');
    }
    try {

        const { rows } = await client.query(`INSERT INTO "images"(name, blob, url)
                VALUES ($1, $2, $3) 
                RETURNING *;`, [name, blob, url]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error creating image..', error);
        throw error;
    }
};
const getImageById = async (id) => {

    try {

        const { rows } = await client.query(`SELECT * FROM images WHERE id=$1;`, [id]);
        testFirstRow(rows);
        return rows[0];
    }

    catch (error) {
        console.error('error getImageById..', error);
        throw error;
    }
};
const getAllImages = async () => {

    try {

        const { rows } = await client.query(`SELECT * FROM images;`);
        testFirstRow(rows);

        return rows;
    }

    catch (error) {
        console.error('error getAllImages..', error);
        throw error;
    }
};
const updateImage = async ({id, name}) => {

    try {
        if ( typeof(name) !== "string" ) {
            throw respError('missingName', 'need to input valid string for name');
        }
        const { rows } = await client.query(`UPDATE images 
        SET name=$1 
        WHERE id=($2)
        RETURNING *;`, [name, id]);
        testFirstRow(rows);

        return rows[0];
    }

    catch (error) {
        console.error('error updateImage..', error);
        throw error;
    }
};
//deletes image from DB by id
const removeImage = async (id) => {

    try {
        const deleteReferencedTable = async ({topTable, bottomTable, referenceName, id}) => {
            const deletedBottomRows = await client.query(`DELETE FROM $1  
            WHERE id=($2) 
            RETURNING *;`, [bottomTable, id]).rows;
            testFirstRow(deletedBottomRows);
            const deletedTopRow = await client.query(`DELETE FROM $1  
            WHERE $2=($3) 
            RETURNING *;`, [ topTable, referenceName, id ]).rows;
            testFirstRow(deletedTopRow);
            deletedTopRow[bottomTable] = deletedBottomRows;
            return deletedTopRow;

        };
        return deleteReferencedTable('images', '"itemImages', 'imageId', id);

    }

    catch (error) {
        console.error('error renoveImage..', error);
        throw error;
    }
};
    

module.exports = {
    createImage,
    getAllImages,
    removeImage,
    getImageById,
    updateImage
}