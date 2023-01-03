const { generateError } = require('../../helpers');
const selectFavExercisesQuery = require('../../db/exerciseQueries/selectFavExercisesQuery');

const listUserFavs = async (req, res, next) => {
    try {
        const exercises = await selectFavExercisesQuery(req.user?.id);

        if (exercises.length < 1) {
            throw generateError('No tienes ejercicios favoritos', 404);
        }

        res.send({
            status: 'ok',
            data: exercises,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = listUserFavs;
