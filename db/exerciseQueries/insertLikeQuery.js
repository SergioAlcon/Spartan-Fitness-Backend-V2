const getConnection = require('../getConnection');

const insertLikeQuery = async (idExercise, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        const [likes] = await connection.query(
            `SELECT value FROM likes WHERE idUser = ? AND idExercise = ?`,
            [idUser, idExercise]
        );

        if (likes.length < 1) {
            await connection.query(
                `INSERT INTO likes (idUser, idExercise, createdAt) VALUES (?, ?, ?)`,
                [idUser, idExercise, new Date()]
            );
        } else {
            await connection.query(
                `UPDATE likes SET value = ?, modifiedAt = ? WHERE idUser = ? AND idExercise = ?`,
                [!likes[0].value, new Date(), idUser, idExercise]
            );

            return !likes[0].value; // IMPLEMENTADO PUEDE DAR ERROR
        }
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertLikeQuery;
