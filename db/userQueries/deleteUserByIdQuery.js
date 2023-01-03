const getConnection = require('../getConnection');

const deleteUserByIdQuery = async (idUser) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`DELETE FROM users WHERE id = ?`, [idUser]);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteUserByIdQuery;
