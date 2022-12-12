const jwt = require('jsonwebtoken');

const { generateError } = require('../helpers');

const isAdmin = async (req, res, next) => {
    try {
        // We get the header token.
        const { authorization } = req.headers;

        // If there is no token we throw an error.
        if (!authorization) {
            throw generateError('Falta la cabecera de autorización', 401);
        }

        // Variable that will contain the information of the token (the id and the role
        // that we added in the "payload" object of "loginUser").
        let payload;

        try {
            // We try to get the information of the token.
            payload = jwt.verify(authorization, process.env.SECRET);
        } catch {
            throw generateError('Token incorrecto', 401);
        }

        // We add a new property (we made it up) to the "request" object with the payload info.
        req.user = payload;

        // We check the role
        if (payload.role !== 'normal') {
            throw generateError('No tienes permisos', 400);
        }

        // We jump to the next controller.
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAdmin;
