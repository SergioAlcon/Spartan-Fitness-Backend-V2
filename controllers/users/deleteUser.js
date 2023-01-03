const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const bcrypt = require('bcrypt');
const { deletePhoto, generateError } = require('../../helpers');
const deleteUserByIdQuery = require('../../db/userQueries/deleteUserByIdQuery');

const deleteUser = async (req, res, next) => {
    try {
        // Obtenemos el id del usuario que queremos borrar.
        const { idUser } = req.params;
        const { password, confirmPassword } = req.body;

        //Si no existe los campos contraseña y su respectiva confirmacion muestra error
        if (!password || !confirmPassword) {
            throw generateError('Debes introducir contraseñas', 403);
        }

        //Obtenemos el datos del usuario
        const user = await selectUserByIdQuery(idUser);

        if (user.length < 1) {
            throw generateError('El usuario no existe', 404);
        }

        const isValid = await bcrypt.compare(confirmPassword, user.password);

        if (!isValid) {
            throw generateError(
                'Las contraseña no es la que está guarda en base de datos',
                403
            );
        }

        // Obtenemos el avatar del usuario.
        /*  const userAvatar = await connection.query(
            `SELECT avatar FROM user WHERE id = ?`,
            [idUser]
        ); */

        /* if (userAvatar[0].avatar) {
          await deletePhoto(userAvatar[0].avatar);
        } */

        // Si el usuario tiene un avatar lo borramos del disco.
        if (user.avatar) {
            await deletePhoto(user.avatar);
        }

        await deleteUserByIdQuery(idUser);

        res.send({
            status: 'ok',
            message: 'Usuario eliminado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = deleteUser;
