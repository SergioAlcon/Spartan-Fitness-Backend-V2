const getConnection = require('../getConnection');

const updateUserQuery = async (username, email, avatar, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(
            `UPDATE users SET username = ?, email = ?, avatar = ?, modifiedAt = ? WHERE id = ?`,
            [username, email, avatar, new Date(), idUser]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserQuery;
