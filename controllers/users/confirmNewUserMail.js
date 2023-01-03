const selectUserByRegCodeQuery = require('../../db/userQueries/selectUserByRegCodeQuery');
const updateUserRegCodeQuery = require('../../db/userQueries/updateUserRegCodeQuery');
const { generateError } = require('../../helpers');

const confirmNewUserMail = async (req, res, next) => {
    try {
        const { registrationCode } = req.params;

        const user = await selectUserByRegCodeQuery(registrationCode);

        if (user.length < 1) {
            throw generateError(
                'No existen usuarios pendientes de validación',
                404
            );
        }

        // Si el usuario está pendiente de validar
        await updateUserRegCodeQuery(registrationCode);

        res.send({
            status: 'OK',
            message: 'Usuario activado, nuevo email registrado',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = confirmNewUserMail;
