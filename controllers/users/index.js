const newUser = require('./newUser');
const loginUser = require('./loginUser');
const getOwnUser = require('./getOwnUser');
const getDataUser = require('./getDataUser');
const editUser = require('./editUser');
const editUserPassword = require('./editUserPassword');
const editUserAvatar = require('./editUserAvatar');
const editUserData = require('./editUserData');
const validateUser = require('./validateUser');
const confirmNewUserMail = require('./confirmNewUserMail');
const deleteUser = require('./deleteUser');
const listUserFavs = require('./listUserFavs');

module.exports = {
    newUser,
    loginUser,
    getOwnUser,
    getDataUser,
    editUser,
    editUserPassword,
    editUserData,
    editUserAvatar,
    validateUser,
    confirmNewUserMail,
    deleteUser,
    listUserFavs,
};
