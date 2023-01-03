const getConnection = require('../getConnection');
const { generateError } = require('../../helpers');

const checkIfEmailDontExists = async (email) => {
    let connection;

    console.log(email);

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (users.length > 0) {
            throw generateError('El email ya existe', 404);
        }
    } finally {
        if (connection) connection.release();
    }
};

module.exports = checkIfEmailDontExists;
