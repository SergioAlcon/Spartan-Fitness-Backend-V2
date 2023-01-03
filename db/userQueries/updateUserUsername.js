const getConnection = require('../getConnection');

const updateUserUsername = async (username, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        // Actualizamos el usuario a activo y eliminamos su código de registro
        await connection.query(
            `
            UPDATE users SET username = ?, modifiedAt = ? WHERE id = ?
            `,
            [username, new Date(), idUser]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserUsername;
