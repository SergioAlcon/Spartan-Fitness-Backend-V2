const insertExerciseQuery = require('../../db/exerciseQueries/insertExerciseQuery');

const { generateError, savePhoto } = require('../../helpers');

const newExercise = async (req, res, next) => {
    try {
        const { name, type, muscle_group, description } = req.body;

        if (!name || !type || !muscle_group || !description) {
            throw generateError('Faltan campos', 400);
        }

        // Variable where we will store the name of the image.
        let image;

        // If there is an image, we save it in a folder on the server
        // and then we save the name of the file in the database.
        if (req.files?.image) {
            // We save the image on the hard drive and get the name.
            image = await savePhoto(req.files.image);
        }

        // We insert the exercise and get the exercise info.
        const exercise = await insertExerciseQuery(
            name,
            type,
            muscle_group,
            description,
            image
        );

        res.send({
            status: 'ok',
            data: exercise,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newExercise;
