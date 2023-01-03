const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const updateUserAvatarQuery = require('../../db/userQueries/updateUserAvatarQuery');
const { generateError, savePhoto, deletePhoto } = require('../../helpers');

const editUserAvatar = async (req, res, next) => {
    try {
        // Obtenemos los campos del body.
        /* let { id } = req.params; */

        // Si faltan todos los campos lanzamos un error.
        if (!(req.files && req.files.avatar)) {
            throw generateError('Debes indicar el nuevo avatar', 400);
        }

        // Obtenemos la info del usuario.
        const user = await selectUserByIdQuery(req.user.id); // si activo linea 9 pongo id aquí

        if (user.avatar) {
            await deletePhoto();
        }

        // Si existe avatar lo guardamos en una carpeta del servidor y posteriormente
        // guardamos el nombre del archivo en la base de datos.
        if (req.files?.avatar) {
            // Si el usuario tiene un avatar asignado lo borramos del disco duro.
            if (user.avatar) {
                await deletePhoto(user.avatar);
            }

            // Guardamos el avatar en el disco duro y obtenemos el nombre.
            await savePhoto(req.files.avatar, 0);
        }

        const avatarName = await savePhoto(req.files.avatar, 0);

        // Actualizamos los datos del usuario.
        await updateUserAvatarQuery(avatarName, req.user.id);

        res.send({
            status: 'ok',
            message: 'Avatar de usuario actualizado',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = editUserAvatar;
