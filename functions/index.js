const admin = require('firebase-admin');

admin.initializeApp();

// USER
const userAPI = require('./pacta/user');

module.exports = {
    ...userAPI
};
