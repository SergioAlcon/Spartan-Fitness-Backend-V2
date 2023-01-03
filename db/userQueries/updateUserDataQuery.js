const getConnection = require('../getConnection');

const updateUserDataQuery = async (
    name,
    surname,
    birthday,
    phone,
    street,
    postalCode,
    province,
    city,
    idUser
) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(
            `UPDATE users SET name = ?, surname = ?, birthday = ?, phone = ?, street = ?, postalCode = ?, province = ?, city = ?, modifiedAt = ? WHERE id = ?`,
            [
                name,
                surname,
                birthday,
                phone,
                street,
                postalCode,
                province,
                city,
                new Date(),
                idUser,
            ]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserDataQuery;
