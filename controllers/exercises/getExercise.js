const selectExerciseByIdQuery = require('../../db/exerciseQueries/selectExerciseByIdQuery');

const getExercise = async (req, res, next) => {
    try {
        const { idExercise } = req.params;

        const exercise = await selectExerciseByIdQuery(
            idExercise,
            req.user?.id
        );

        res.send({
            status: 'ok',
            data: exercise,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getExercise;
