const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const selectUserByEmailQuery = async (email) => {
    let connection;

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT id, password, role FROM users WHERE email = ?`,
            [email]
        );

        if (users.length < 1) {
            throw generateError('Usuario no encontrado', 404);
        }
        // Since there should not be more than one user with the same email,
        // the maximum number of users that will come in the users array is 1.
        // If so, we return the user that is in position 0 of the "users" array.
        return users[0];
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectUserByEmailQuery;
