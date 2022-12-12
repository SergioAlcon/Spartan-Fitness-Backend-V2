const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');

const getDataUser = async (req, res, next) => {
    try {
        /* (req.params.id, false); */
        const user = await selectUserByIdQuery(req.user.id, false);

        res.send({
            status: 'ok',
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getDataUser;
