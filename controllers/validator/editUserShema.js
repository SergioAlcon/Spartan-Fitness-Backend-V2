const joi = require('joi');

const editUserSchema = joi.object().keys({
    username: joi.string().min(3).max(12),
    email: joi.string().max(50).email(),
});

module.exports = editUserSchema;
