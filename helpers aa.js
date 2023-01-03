const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const sgMail = require('@sendgrid/mail');
// Asignameos el API Key a sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * #####################
 * ## GENERATE ERROR  ##
 * #####################
 */
const generateError = (message, code) => {
    const err = new Error(message);
    err.statusCode = code;
    return err;
};

/**
 * #####################
 * ## VALIDATE SCHEMA ##
 * #####################
 */

const validateSchema = async (schema, data) => {
    const validation = schema.validate(data);
    if (validation.error) throw generateError(validation.error.message, 400);
};

/**
 * #####################
 * ##  VERIFY  EMAIL  ##
 * #####################
 */

const verifyEmail = async (email, registrationCode) => {
    // Asunto del email
    const subject = 'Activación de tu usuario SPARTAN Fitness';

    // Mensaje que enviaremos al email del usuario
    const emailBody = `
    Te acabas de registrar en SPARTAN Fitness.
    Pulsa este enlace para verificar tu cuenta: http://${process.env.MYSQL_HOST}:${process.env.PORT}/users/validate/${registrationCode}
    `;

    try {
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM,
            subject,
            text: emailBody,
            html: `
                <div>
                    <h2>${subject}</h2>
                    <p>${emailBody}</p>
                </div>
                `,
        };

        // Enviamos el mensaje
        await sgMail.send(msg);
    } catch {
        throw generateError('Error al mandar el correo');
    }
};

/**
 * #####################
 * ##  CHANGE  EMAIL  ##
 * #####################
 */

const changeEmail = async (email, registrationCode) => {
    // Asunto del email
    const subject = 'Nuevo correo para activación de usuario';

    // Mensaje que enviaremos al email del usuario
    const emailBody = `
    Confirmación de cambio de correo.
    Pulsa este enlace para verificar tu cuenta con el nuevo correo proporcionado: http://${process.env.MYSQL_HOST}:${process.env.PORT}/users/mail/${registrationCode}
    `;

    try {
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM,
            subject,
            text: emailBody,
            html: `
                <div>
                    <h2>${subject}</h2>
                    <p>${emailBody}</p>
                </div>
                `,
        };

        // Enviamos el mensaje
        await sgMail.send(msg);
    } catch {
        throw generateError('Error al mandar el correo');
    }
};

/**
 * #####################
 * ##   SAVE  PHOTO   ##
 * #####################
 */
const savePhoto = async (img) => {
    // We create an absolute path to the directory where we are going to upload the images.
    const uploadsPath = path.join(__dirname, process.env.UPLOADS_DIR);

    try {
        // We try to access the file upload directory using the "access" method of fs.
        // This method generates an error if the file cannot be accessed.
        await fs.access(uploadsPath);
    } catch {
        // If the error pops up it means that the directory does not exist so we create it.
        await fs.mkdir(uploadsPath);
    }

    // We process the image and convert it into a "Sharp" type object.
    const sharpImg = sharp(img.data);

    // We resized the image to prevent them from being too heavy. We assign a maximum width of 800px.
    sharpImg.resize(350);

    // We generate a unique name for the image.
    const imgName = `${uuid()}.jpg`;

    // We generate the absolute path where we want to save the image.
    const imgPath = path.join(uploadsPath, imgName);

    // We save the image in the corresponding directory.
    await sharpImg.toFile(imgPath);

    // We return the name that we have given to the image.
    return imgName;
};

/**
 * #####################
 * ##  DELETE  PHOTO  ##
 * #####################
 */
const deletePhoto = async (imgName) => {
    try {
        // We create the absolute path to the image we want to delete.
        const imgPath = path.join(__dirname, process.env.UPLOADS_DIR, imgName);

        try {
            // We try to access the file with the image using the "access" method of fs.
            // This method generates an error if the file cannot be accessed.
            await fs.access(imgPath);
        } catch {
            // If the error pops up, it means that the image does not exist, so we make a return
            //  and finish the function.
            return false;
        }

        // We delete the image from the hard drive.
        await fs.unlink(imgPath);

        return true;
    } catch {
        throw generateError('Error al eliminar la imagen del servidor');
    }
};

module.exports = {
    generateError,
    savePhoto,
    deletePhoto,
    validateSchema,
    verifyEmail,
    changeEmail,
};
