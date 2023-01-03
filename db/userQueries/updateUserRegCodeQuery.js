const getConnection = require("../getConnection");


const updateUserRegCodeQuery = async (registrationCode) => {
    let connection;

    try {
        
        connection = await getConnection();

        // Actualizamos el usuario a activo y eliminamos su código de registro
        await connection.query(
            `
            UPDATE users SET active = true, registrationCode = null, modifiedAt = ? WHERE registrationCode = ?
            `,[new Date(), registrationCode]
            )

    } finally {
        if(connection) connection.release();
    }
}

module.exports = updateUserRegCodeQuery;