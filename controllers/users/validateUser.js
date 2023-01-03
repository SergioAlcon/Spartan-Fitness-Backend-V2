const selectUserByRegCodeQuery = require("../../db/userQueries/selectUserByRegCodeQuery");
const updateUserRegCodeQuery = require("../../db/userQueries/updateUserRegCodeQuery");

const validateUser = async (req, res, next) => {

    try {
        const { registrationCode } = req.params;

        // Si el usuario no existe nos dará un error
        const user = await selectUserByRegCodeQuery (registrationCode);

        // Actualizamos el usuario
        await updateUserRegCodeQuery(registrationCode)


        res.send ({
            status: 'ok',
            message: 'Activated user',
        });

    } catch (err) {
        next(err);
    }

}

module.exports = validateUser;