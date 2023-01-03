const getConnection = require('../getConnection');
const bcrypt = require('bcrypt');

const updateUserPasswordQuery = async (password, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        // We encrypt the password.
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            `UPDATE users SET password = ?, modifiedAt = ? WHERE id = ?`,
            [hashedPassword, new Date(), idUser]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserPasswordQuery;
