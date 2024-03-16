const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

const db = admin.firestore();

exports.addConsultant = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { id, username, email, role, profileImage } = req.body;

            const userData = {
                id,
                username,
                email,
                role,
                profileImage
            };

            await db.collection('consultants').doc(id).set({
                id,
                username,
                email,
                role,
                profileImage,
            });

            return res.status(201).json({ code: 1, userData, message: 'Adding user successful' });
        } catch (error) {
            console.error('Error adding user:', error);
            return res.status(500).json({ code: -1, error: 'Internal server error', message: 'Something went wrong' });
        }
    });
});
