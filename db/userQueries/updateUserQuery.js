const getConnection = require('../getConnection');

const updateUserQuery = async (username, email, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(
            `UPDATE users SET username = ?, email = ?, modifiedAt = ? WHERE id = ?`,
            [username, email, new Date(), idUser]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserQuery;
