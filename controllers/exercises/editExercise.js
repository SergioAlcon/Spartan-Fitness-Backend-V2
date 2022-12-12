const selectExerciseByIdQuery = require('../../db/exerciseQueries/selectExerciseByIdQuery');
const updateExerciseQuery = require('../../db/exerciseQueries/updateExerciseQuery');

const { generateError, savePhoto, deletePhoto } = require('../../helpers');

const editExercise = async (req, res, next) => {
    try {
        // We get the fields of the body.
        let { name, type, muscle_group, description } = req.body;

        let { idExercise } = req.params;

        // If all the fields are missing we throw an error.
        if (
            !name &&
            !type &&
            !muscle_group &&
            !description &&
            !req.files?.image
        ) {
            throw generateError('Faltan campos', 400);
        }

        // We get the user information.
        const exercise = await selectExerciseByIdQuery(idExercise);

        // Variable where we will store the name of the image.
        let image;

        // If there is an image, we save it in a folder on the server and then
        // we save the name of the file in the database.
        if (req.files?.image) {
            // If the user has an image assigned, we delete it from the hard drive.
            if (exercise.image) {
                await deletePhoto(exercise.image);
            }

            // We save the image on the hard drive and get the name.
            image = await savePhoto(req.files.image);
        }

        // We set the final value for the variables. In case the user does not send the
        // username, the email or the image, we keep the value that is in the database.
        name = name || exercise.name;
        type = type || exercise.type;
        muscle_group = muscle_group || exercise.muscle_group;
        description = description || exercise.description;
        image = image || exercise.image;

        // We update the user data.
        await updateExerciseQuery(
            name,
            type,
            muscle_group,
            description,
            image,
            idExercise
        );

        res.send({
            status: 'ok',
            message: 'Ejercicio actualizado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = editExercise;
