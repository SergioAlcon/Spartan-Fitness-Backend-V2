const selectFavExercisesQuery = require('../../db/exerciseQueries/selectFavExercisesQuery');

const listExercises = async (req, res, next) => {
    try {
        const { type, muscle_group } = req.query;

        const exercises = await selectFavExercisesQuery(
            req.user?.id,
            type,
            muscle_group
        );

        res.send({
            status: 'ok',
            data: exercises,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = listExercises;
