require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const { PORT, /* UPLOADS_DIR, */ MYSQL_HOST } = process.env;

const app = express();

app.use(cors('cors'));
// Middleware that makes use of the "morgan" logger.
app.use(morgan('dev'));

// Middleware that deserializes the body and makes it available in "req.body".
app.use(express.json());

// Middleware that deserializes a body with "form-data" format.
app.use(fileUpload());

//export uploads
app.use('/uploads', express.static('./uploads'));
/* app.use(express.static(UPLOADS_DIR)); */

// MIDDLEWARES
const authUser = require('./middlewares/authUser');
const isAdmin = require('./middlewares/isAdmin.js');
const isNormal = require('./middlewares/isNormal.js');
const authUserOptional = require('./middlewares/authUserOptionaL.js');

// USERS ENDPOINTS
const {
    newUser,
    loginUser,
    getOwnUser,
    getDataUser,
    editUser,
    editUserData,
    editUserPassword,
    editUserAvatar,
    validateUser,
    confirmNewUserMail,
    deleteUser,
    listUserFavs,
} = require('./controllers/users');

// User registration.
app.post('/users/register', newUser);

// User login.
app.post('/users/login', loginUser);

// User email verification.
app.get('/users/validate/:registrationCode', validateUser);

// Info of a logged user.
app.get('/users', authUser, getOwnUser);

// Info page of a logged user.
app.get('/users/:idUser', authUserOptional, getDataUser);
/* app.get('/users/:idUser', authUser, getOwnUser); */

// Listado de ejercicios favoritos del usuario
app.get('/users/:idUser/favourites', authUser, listUserFavs);

// Activamos de nuevo el usuario con nuevo correo
app.post('/users/mail/:registrationCode', confirmNewUserMail);

// Editamos username e email de Usuario.
app.put('/users/:idUser', authUser, editUser);

// Editamos la contraseña del usuario
app.put('/users/:idUser/info', authUser, editUserData);

// Editamos los datos del usuario.
app.put('/users/:idUser/password', authUser, editUserPassword);

// Editamos el avatar del usuario.
app.put('/users/:idUser/avatar', authUser, editUserAvatar);

// Borramos usuario
app.delete('/users/:idUser', deleteUser);

// EXERCISES ENDPOINTS
const {
    newExercise,
    listExercises,
    getExercise,
    likeExercise,
    favExercise,
    editExercise,
    deleteExercise,
} = require('./controllers/exercises');

// Create a new exercise.
app.post('/exercises/new', isAdmin, newExercise);

// Like an exercise.
app.post('/exercises/:idExercise/likes', isNormal, likeExercise);

// Favorite an exercise.
app.post('/exercises/:idExercise/favs', isNormal, favExercise);

// List exercises.
app.get('/exercises', authUserOptional, listExercises);

// Info of a specific exercise.
app.get('/exercises/:idExercise', authUserOptional, getExercise);

// Modify an exercise.
app.put('/exercises/:idExercise/edit', isAdmin, editExercise);

// Delete an exercise.
app.delete('/exercises/:idExercise', isAdmin, deleteExercise);

// MIDDLEWARE OF ERROR
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message,
    });
});
// MIDDLEWARE OF NOT FOUND
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'No encontrado',
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://${MYSQL_HOST}:${PORT}`);
});
