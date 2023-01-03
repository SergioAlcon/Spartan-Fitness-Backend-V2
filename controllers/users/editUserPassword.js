const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const updateUserPasswordQuery = require('../../db/userQueries/updateUserPasswordQuery');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');

const editUserPassword = async (req, res, next) => {
    try {
        // Obtenemos los campos del body.
        let { oldPassword, newPassword } = req.body;

        // Si faltan todos los campos lanzamos un error.
        if (!oldPassword && !newPassword) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos la info del usuario.
        const user = await selectUserByIdQuery(req.user.id);

        console.log(user);
        console.log(user.password);
        console.log(oldPassword);

        //Guardamos en una variable un valor booleano: contraseña correcta o incorrecta.
        const isValid = await bcrypt.compare(oldPassword, user.password);

        //Si la contraseña antigua es errónea, lanzamos un error.
        if (!isValid) {
            throw generateError('Contraseña incorrecta', 401);
        }

        /* //Hasheamos la nueva contraseña.
        const hashedPassword = await bcrypt.hash(newPassword, 10); */

        // Actualizamos los datos del usuario.
        await updateUserPasswordQuery(newPassword, req.user.id);

        res.send({
            status: 'ok',
            message: 'Contraseña actualizado',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = editUserPassword;
