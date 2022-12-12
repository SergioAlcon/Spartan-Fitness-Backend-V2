const getConnection = require('../getConnection');
const bcrypt = require('bcrypt');

const { generateError } = require('../../helpers');

const insertUserQuery = async (username, email, password) => {
    let connection;

    try {
        connection = await getConnection();

        // We obtain an array of users based on the established username.
        const [usernameUsers] = await connection.query(
            `SELECT id FROM users WHERE username = ?`,
            [username]
        );

        // If there is any user with that username we throw an error.
        if (usernameUsers.length > 0) {
            throw generateError(
                'Ya existe un usuario con ese nombre en la base de datos',
                403
            );
        }

        // We obtain an array of users based on the email or the established username.
        const [emailUsers] = await connection.query(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        // If there is any user with that email, we launch an error.
        if (emailUsers.length > 0) {
            throw generateError(
                'Ya existe un usuario con ese email en la base de datos',
                403
            );
        }

        // We encrypt the password.
        const hashedPassword = await bcrypt.hash(password, 10);

        // We create the user.
        await connection.query(
            `INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, ?)`,
            [username, email, hashedPassword, new Date()]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertUserQuery;
