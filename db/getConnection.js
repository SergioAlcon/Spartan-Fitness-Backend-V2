const mysql = require('mysql2/promise');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

// Variable that will store a pool (a list) of connections.
let pool;

// Function that returns a free connection.
const getConnection = async () => {
    try {
        // If there is no connection pool, we create it.
        if (!pool) {
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DB,
                timezone: 'Z', // All dates are stored in the same time zone.
            });
        }

        // We return a free connection.
        return await pool.getConnection();
    } catch (err) {
        console.error(err);
        throw new Error('Error al conectar con MySQL');
    }
};

module.exports = getConnection;
