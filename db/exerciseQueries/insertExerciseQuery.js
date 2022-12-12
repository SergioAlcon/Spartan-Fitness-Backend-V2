const getConnection = require('../getConnection');

const insertExerciseQuery = async (
    name,
    type,
    muscle_group,
    description,
    image
) => {
    let connection;

    try {
        connection = await getConnection();

        // Variable that stores a Date object with the current date.
        const createdAt = new Date();

        // If we want to obtain the id with which the new exercise has been saved in the database,
        // it is necessary to access the object in position 0 of the array returned by connection.query.
        const [newExercise] = await connection.query(
            `
                INSERT INTO exercises (name, type, muscle_group, description, image, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [name, type, muscle_group, description, image, createdAt]
        );

        // We return the information of the exercise.
        return {
            id: newExercise.insertId,
            name,
            type,
            muscle_group,
            description,
            image,
            createdAt,
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertExerciseQuery;
