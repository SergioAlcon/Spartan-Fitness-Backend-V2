const insertLikeQuery = require('../../db/exerciseQueries/insertLikeQuery');
const selectExerciseByIdQuery = require('../../db/exerciseQueries/selectExerciseByIdQuery');

const likeExercise = async (req, res, next) => {
    try {
        const { idExercise } = req.params;

        await selectExerciseByIdQuery(idExercise, req.user.id);

        await insertLikeQuery(idExercise, req.user.id);

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

module.exports = likeExercise;
