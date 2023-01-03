const getConnection = require('../getConnection');
const { generateError } = require('../../helpers');

const checkIfUsernameDontExists = async (username) => {
    let connection;

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );

        if (users.length > 0) {
            throw generateError('El username ya existe', 404);
        }
    } finally {
        if (connection) connection.release();
    }
};

module.exports = checkIfUsernameDontExists;
