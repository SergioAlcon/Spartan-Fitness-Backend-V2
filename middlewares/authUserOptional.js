const jwt = require('jsonwebtoken');

const { generateError } = require('../helpers');

const authUserOptional = async (req, res, next) => {
    try {
        // We get the token from the header.
        const { authorization } = req.headers;

        // If there is a token...
        if (authorization) {
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
        }

        // We jump to the next controller.
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authUserOptional;
