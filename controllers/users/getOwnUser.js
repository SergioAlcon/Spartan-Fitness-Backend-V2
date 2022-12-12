const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');

const getOwnUser = async (req, res, next) => {
    try {
        const user = await selectUserByIdQuery(req.user.id, false);

        res.send({
            status: 'ok',
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getOwnUser;
