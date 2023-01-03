const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const selectUserByEmailQuery = require('../../db/userQueries/selectUserByEmailQuery');
const { generateError } = require('../../helpers');

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError('Faltan campos', 400);
        }

        // We get the user with the email that comes in the body.
        const user = await selectUserByEmailQuery(email);

        // We check if the passwords match.
        const validPassword = await bcrypt.compare(password, user.password);

        // If the passwords do not match we throw an error.
        if (!validPassword) {
            throw generateError('Contraseña incorrecta', 401);
        }

        // We generate an object with the information we want to add to the token.
        const payload = {
            id: user.id,
            role: user.role,
        };

        // We generate the token.
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '10d',
        });

        res.send({
            status: 'ok',
            data: token,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = loginUser;
