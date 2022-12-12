const selectExerciseByIdQuery = require('../../db/exerciseQueries/selectExerciseByIdQuery');
const deleteExerciseByIdQuery = require('../../db/exerciseQueries/deleteExerciseByIdQuery');

const { deletePhoto, generateError } = require('../../helpers');

const deleteExercise = async (req, res, next) => {
    try {
        const { idExercise } = req.params;

        const exercise = await selectExerciseByIdQuery(
            idExercise,
            req.user?.id
        );

        // If the exercise has an image linked, we delete it.

        // Si implemento esto no borra el ejercicio.
        /* if (exercise.idUser !== 1) {
            throw generateError('No tienes suficientes permisos', 401);
        } */

        if (exercise.image) {
            await deletePhoto(exercise.image);
        }

        await deleteExerciseByIdQuery(idExercise);

        res.send({
            status: 'ok',
            message: 'Ejercicio eliminado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = deleteExercise;
