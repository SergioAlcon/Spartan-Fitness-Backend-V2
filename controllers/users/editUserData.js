const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const updateUserDataQuery = require('../../db/userQueries/updateUserDataQuery');
/* const editUserSchema = require('../../validator/editUserShema'); */
const { generateError /* , validateSchema */ } = require('../../helpers');

const editUserData = async (req, res, next) => {
    try {
        /* const { idUser } = req.params; */
        // Obtenemos los campos del body.
        let {
            name,
            surname,
            birthday,
            phone,
            street,
            postalCode,
            province,
            city,
        } = req.body;

        // Si faltan todos los campos lanzamos un error.
        if (
            !name &&
            !surname &&
            !birthday &&
            !phone &&
            !street &&
            !postalCode &&
            !province &&
            !city
        ) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos la info del usuario.
        const user = await selectUserByIdQuery(req.user.id);

        // Establecemos el valor final para las variables. En caso de que
        // el usuario no envíe el nombre de usuario, el email o el avatar
        // nos quedamos con el valor que haya en la base de datos.

        name = name || user.name;
        surname = surname || user.surname;
        birthday = birthday || user.birthday;
        phone = phone || user.phone;
        street = street || user.street;
        postalCode = postalCode || user.postalCode;
        province = province || user.province;
        city = city || user.city;

        /* const validateData = {
            username: username,
            email: email,
        };

        // Validamos los datos del body con joi
        await validateSchema(editUserSchema, validateData); */

        // Actualizamos los datos del usuario.
        await updateUserDataQuery(
            name,
            surname,
            birthday,
            phone,
            street,
            postalCode,
            province,
            city,
            req.user.id
        );

        res.send({
            status: 'ok',
            message: 'Datos de usuario modificados con éxito',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = editUserData;
