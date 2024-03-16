const admin = require('firebase-admin');

admin.initializeApp();

// USER
const userAPI = require('./pacta/user');

// CONSULTANT
const consultantAPI = require('./pacta/consultant');

module.exports = {
    ...userAPI,
    ...consultantAPI
};
