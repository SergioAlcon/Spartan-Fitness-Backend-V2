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
} = require('./controllers/users');

// User registration.
app.post('/users/register', newUser);

// User email verification.
app.get('/users/validate/:registrationCode', validateUser);

// User login.
app.post('/users/login', loginUser);

// Info of a logged user.
app.get('/users', authUser, getOwnUser);

// Info page of a logged user.
app.get('/users/:idUser', authUserOptional, getDataUser);
/* app.get('/users/:idUser', authUser, getOwnUser); */

// Edit and user.
app.put('/users/:idUser', authUser, editUser);

// Editamos la contraseña del usuario
app.put('/users/:idUser/info', authUser, editUserData);

// Editamos los datos del usuario.
app.put('/users/:idUser/password', authUser, editUserPassword);

// Editamos el avatar del usuario.
app.put('/users/:idUser/avatar', authUser, editUserAvatar);

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

// List exercises.
app.get('/exercises', authUserOptional, listExercises);

// Info of a specific exercise.
app.get('/exercises/:idExercise', authUserOptional, getExercise);

// Like an exercise.
app.post('/exercises/:idExercise/likes', isNormal, likeExercise);

// Favorite an exercise.
app.post('/exercises/:idExercise/favs', isNormal, favExercise);

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
