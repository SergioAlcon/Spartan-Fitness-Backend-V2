const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const checkIfEmailDontExists = require('../../db/userQueries/checkIfEmailDontExists');
const checkIfUsernameDontExists = require('../../db/userQueries/checkIfUsernameDontExists');
const updateUserMailQuery = require('../../db/userQueries/updateUserMailQuery');
const updateUserUsername = require('../../db/userQueries/updateUserUsername');
const updateUserQuery = require('../../db/userQueries/updateUserQuery');
const editUserSchema = require('../../validator/editUserShema');
const { generateError, validateSchema, changeEmail } = require('../../helpers');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

const editUser = async (req, res, next) => {
    try {
        //Obtener el id usuario para modificar
        /*  const { idUser } = req.params;

        console.log(idUser); */

        // Obtenemos los campos del body.
        let { username, email, password } = req.body;

        // Si faltan todos los campos lanzamos un error.
        if (!username && !email) {
            throw generateError('Faltan campos', 400);
        }

        if (!password) {
            throw generateError(
                'Introduce tu contraseña para verificar los cambios',
                401
            );
        }

        // Obtenemos la info del usuario.
        /* const user = await selectUserByIdQuery(idUser); */
        const user = await selectUserByIdQuery(req.user.id);

        // We check if the passwords match.
        const validPassword = await bcrypt.compare(password, user.password);

        // If the passwords do not match we throw an error.
        if (!validPassword || user.length < 1) {
            throw generateError('Contraseña incorrecta', 401);
        }

        /* // Validamos los datos del body con joi
        await validateSchema(editUserSchema, req.body); */

        // Variable message que se enviará en el res.send
        let message = 'Usuario actualizado:';

        // Si existen newUsername y newEmail pero son iguales a los ya registrados no se hace la actualización
        if (
            username &&
            username === user.username &&
            email &&
            email === user.email
        ) {
            throw generateError('No se ha podido actualizar el usuario', 409);
        }

        // En caso de que actualice su email, comprobamos si es distinto al existente

        if (email && email !== user.email) {
            await checkIfEmailDontExists(email);

            // Generamos un código de registro
            const registrationCode = uuid();

            await updateUserMailQuery(email, registrationCode, req.user.id);

            // enviamos mail de confirmacion al nuevo email registrado
            await changeEmail(email, registrationCode);

            //Actualizamos el mensage que enviaremos al "res.send".
            message += ' comprueba tu nuevo correo para activarlo.';
        }

        /* En caso de que haya username comprobamos si es distinto al existente
        y que no esté en uso por otro usuario */

        if (username && username !== user.username) {
            await checkIfUsernameDontExists(username);

            await updateUserUsername(username, req.user.id);

            //Actualizamos el mensage que enviaremos al "res.send".
            message += ' Nombre de usuario actualizado.';
        }

        /*  const validateData = {
            username: username,
            email: email,
        }; */

        /*  // Validamos los datos del body con joi
        await validateSchema(editUserSchema, validateData); */

        // Actualizamos los datos del usuario.
        await updateUserQuery(username, email, req.user.id);

        res.send({
            status: 'ok',
            message,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = editUser;
