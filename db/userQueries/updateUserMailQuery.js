const getConnection = require('../getConnection');

const updateUserMailQuery = async (email, registrationCode, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        // Actualizamos el usuario a activo y eliminamos su código de registro
        await connection.query(
            `
            UPDATE users SET email = ?, active = false, registrationCode = ?, modifiedAt = ? WHERE id = ?
            `,
            [email, registrationCode, new Date(), idUser]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserMailQuery;
