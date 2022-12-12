const getConnection = require('../getConnection');

const deleteExerciseByIdQuery = async (idExercise) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`DELETE FROM exercises WHERE id = ?`, [
            idExercise,
        ]);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteExerciseByIdQuery;
