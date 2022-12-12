const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');

require('dotenv').config();

// GENERATE ERROR
const generateError = (message, code) => {
    const err = new Error(message);
    err.statusCode = code;
    return err;
};

// SAVE PHOTO
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

// DELETE PHOTO
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
};
