const joi = require('joi');

const newUserSchema = joi.object().keys({
    username: joi.string().min(3).max(12).required(),
    email: joi.string().email().max(50).required(),
    password: joi
        .string()
        .min(8)
        .max(20)
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[¡!$%^&*()_+|~=`{}:";'<>¿?,.])[a-zA-Z0-9¡!$%^&*()_+|~=`{}:";'<>¿?,.]{8,}$/
        )
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere contraseña');
                case 'string.pattern.base':
                    return new Error(
                        'La contraseña debe contener 1 letra mayúscula 1 letra minúscula y un signo de puntuación'
                    );
                case 'string.min':
                    return new Error(
                        'La contraseña debe tener al menos 8 caracteres'
                    );
                case 'string.max':
                    return new Error(
                        'La contraseña debe tener como máximo 20 caracteres'
                    );
            }
        }),
});

module.exports = newUserSchema;
