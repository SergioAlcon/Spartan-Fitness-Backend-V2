const insertUserQuery = require('../../db/userQueries/insertUserQuery');
const newUserSchema = require('../validator/newUserSchema');

const { generateError, savePhoto, validateSchema } = require('../../helpers');

const newUser = async (req, res, next) => {
    try {
        // We get the fields of the body.
        const { username, email, password } = req.body;

        // If any field is missing we throw an error.
        if (!username || !email || !password /* || !req.files?.avatar */) {
            throw generateError('Faltan campos', 400);
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

        // We insert a new user in the database.
        await insertUserQuery(username, email, password, avatar);

        res.send({
            status: 'ok',
            message: 'Usuario creado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newUser;
