const { generateError } = require("../../helpers");
const getConnection = require("../getConnection");



const selectUserByRegCodeQuery = async (registrationCode) => { 
    let connection;

    try {
        connection = await getConnection();

        // Seleccionamos el id del usuario en relación a su codigo de registro
        const [users] = await connection.query(
            `
            SELECT id FROM users WHERE registrationCode = ?
            `,[registrationCode]
            );
            
            // Si no existe el usuario lanzamos un error
            if (users.length < 1) throw generateError('User not found', 404)

           // Devolvemos el usuario
            return users[0];
    } finally {
        if(connection) connection.release();
    }

}

module.exports = selectUserByRegCodeQuery;