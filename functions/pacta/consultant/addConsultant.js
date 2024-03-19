const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

const db = admin.firestore();

exports.addConsultant = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { id, username, email, role, profileImage, phoneNumber, gender } = req.body;

            const consultantRef = await db.collection('consultants').doc(id).get();
            if (consultantRef.exists) {
                const userData = consultantRef.data();
                return res.status(200).json({
                    code: 1,
                    message: 'User already exists',
                    userData: userData
                });
            }

            const userRef = await db.collection('users').doc(id).get();
            if (userRef.exists) {
                return res.status(401).json({
                    code: -1,
                    message: 'You are already registered as a user. Please sign in as a user.',

                });
            }

            const consultantData = {
                id,
                username,
                email,
                role,
                profileImage,
                phoneNumber,
                gender,
            };

            await db.collection('consultants').doc(id).set(consultantData);

            return res.status(201).json({ code: 1, userData, message: 'Adding consultant successful' });
        } catch (error) {
            console.error('Error adding user:', error);
            return res.status(500).json({ code: -1, error: 'Internal server error', message: 'Something went wrong' });
        }
    });
});
