const insertUserQuery = require('../../db/userQueries/insertUserQuery');
const newUserSchema = require('../../validator/newUserSchema');
const { v4: uuid } = require('uuid');

const {
    generateError,
    savePhoto,
    validateSchema,
    verifyEmail,
} = require('../../helpers');

const newUser = async (req, res, next) => {
    try {
        // We get the fields of the body.
        const { username, email, password } = req.body;

        // If any field is missing we throw an error.
        if (!username || !email || !password) {
            throw generateError('Faltan campos', 403);
        }

        // Variable donde almacenaremos el nombre de la imagen.
        let avatar;

        // Si existe avatar lo guardamos en una carpeta del servidor y posteriormente
        // guardamos el nombre del archivo en la base de datos.
        if (req.files?.avatar) {
            // Guardamos el avatar en el disco duro y obtenemos el nombre.
            avatar = await savePhoto(req.files.avatar);
        }

        // Validamos los datos del body con joi
        await validateSchema(newUserSchema, req.body);

        // Generamos un código de registro
        const registrationCode = uuid();

        // Enviamos un email de verificación
        await verifyEmail(email, registrationCode);

        // We insert a new user in the database.
        await insertUserQuery(
            username,
            email,
            password,
            avatar,
            registrationCode
        );

        res.send({
            status: 'ok',
            message: 'Usuario registrado, comprueba tu email para activarlo',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newUser;
