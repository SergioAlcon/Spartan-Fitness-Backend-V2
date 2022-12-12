# Gym Workouts App

Application to internally organize training sessions in a gym.
Implement an API that allows you to publish exercises for the management of
themselves in a gym. The users will be the workers of the gym.

## Install

-   Create an empty database called gimnasio on a local MySQL instance..

-   Save the `.env.example` file as `.env` and fill in the necessary data.

-   Run `npm run initDB` to create the necessary tables in the previously created database.

-   Run `npm run dev` or `npm start` to launch the server.

## Entidades

-   Users:

    -   id
    -   username
    -   email
    -   role
    -   password
    -   createdAt

-   Exercises:

    -   id
    -   name
    -   type
    -   muscle group
    -   description
    -   image
    -   createdAt
    -   updatedAt

-   Likes:

    -   id
    -   idUser
    -   idExercise
    -   like
    -   createdAt
    -   updatedAt

-   Favourite:
    -   id
    -   idUser
    -   idExercise
    -   favourite
    -   createdAt
    -   updatedAt

## Endpoints

### Users:

-   POST [/users/register] - User register.✅
-   POST [/users/login] - User login .**TOKEN**✅

### Exercises:

-   POST [/exercises] - Allows you to create an exercise only if you are admin. **TOKEN**✅
-   GET [/exercises] - List all exercises. Filter by type or group.**TOKEN**✅
-   GET [/exercises/:idExercise] - Returns an specific exercise.**TOKEN**✅
-   POST [/exercise/:idExercise/like] - Add or remove a like to an exercise only if you are normal. **TOKEN**✅
-   DELETE [/exercises/:idExercise] - Delete an exercise only if you are admin. **TOKEN**✅
-   PUT [/exercises/:idExercise/edit] - Modify an exercise only if you are admin. **TOKEN**✅

### Extra:

-   POST [/exercise/:idExercise/favs] - Add or remove a fav to an exercise only if you are normal. **TOKEN**
