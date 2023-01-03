const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const checkIfEmailDontExists = require('../../db/userQueries/checkIfEmailDontExists');
const selectUserByUsernameQuery = require('../../db/userQueries/selectUserByUsernameQuery');
const updateUserMailQuery = require('../../db/userQueries/updateUserMailQuery');
const updateUserUsername = require('../../db/userQueries/updateUserUsername');
const updateUserQuery = require('../../db/userQueries/updateUserQuery');
const editUserSchema = require('../../validator/editUserShema');
const { generateError, validateSchema, changeEmail } = require('../../helpers');
const { v4: uuid } = require('uuid');

const editUser = async (req, res, next) => {
    try {
        //Obtener el id usuario para modificar
        /*  const { idUser } = req.params;

        console.log(idUser); */

        // Obtenemos los campos del body.
        let { username, email } = req.body;

        // Si faltan todos los campos lanzamos un error.
        if (!username && !email) {
            throw generateError('Faltan campos', 400);
        }

        /* // Validamos los datos del body con joi
        await validateSchema(editUserSchema, req.body); */

        // Obtenemos la info del usuario.
        /* const user = await selectUserByIdQuery(idUser); */
        const user = await selectUserByIdQuery(req.user.id);

        console.log(user);
        /* 
        console.log('------------user------------------');
        console.log(user);

        console.log('-------------user.email-----------------');
        console.log(user.email);
        console.log('----------------user.username--------------');
        console.log(user.username);
        console.log('----------------username--------------');
        console.log(username);
        console.log('----------------email--------------');
        console.log(email); */

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

        /* const validateData = {
            username: username,
            email: email,
        };

        // Validamos los datos del body con joi
        await validateSchema(editUserSchema, validateData); */

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

        const usernameQuery = await selectUserByUsernameQuery(
            username,
            req.user.id
        );

        console.log(username);

        if (usernameQuery.length > 0) {
            throw generateError('Ya existe un usuario con ese nombre', 409);
        }

        if (username && username !== user.username) {
            await updateUserUsername(username);

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
