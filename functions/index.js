const admin = require('firebase-admin');

admin.initializeApp();

// USER
const userAPI = require('./pacta/user');

// CONSULTANT
const consultantAPI = require('./pacta/consultant');

// MESSAGE
const messageAPI = require('./pacta/message');

module.exports = {
    ...userAPI,
    ...consultantAPI,
    ...messageAPI,
};
