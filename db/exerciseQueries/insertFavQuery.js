const getConnection = require('../getConnection');

const insertFavQuery = async (idExercise, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        const [favs] = await connection.query(
            `SELECT value FROM favs WHERE idUser = ? AND idExercise = ?`,
            [idUser, idExercise]
        );

        if (favs.length < 1) {
            await connection.query(
                `INSERT INTO favs (idUser, idExercise, createdAt) VALUES (?, ?, ?)`,
                [idUser, idExercise, new Date()]
            );

            return true;
        } else {
            await connection.query(
                `UPDATE favs SET value = ?, modifiedAt = ? WHERE idUser = ? AND idExercise = ?`,
                [!favs[0].value, new Date(), idUser, idExercise]
            );

            return !favs[0].value;
        }
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertFavQuery;
