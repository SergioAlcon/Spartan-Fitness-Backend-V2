const insertFavQuery = require('../../db/exerciseQueries/insertFavQuery');
const selectExerciseByIdQuery = require('../../db/exerciseQueries/selectExerciseByIdQuery');

const favExercise = async (req, res, next) => {
    try {
        const { idExercise } = req.params;

        await selectExerciseByIdQuery(idExercise);

        await insertFavQuery(idExercise, req.user?.id);

        const updatedExercise = await selectExerciseByIdQuery(
            idExercise,
            req.user.id
        );

        res.send({
            status: 'ok',
            data: updatedExercise,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = favExercise;
