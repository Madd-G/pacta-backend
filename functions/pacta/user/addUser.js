const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

const db = admin.firestore();

exports.addUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { id, username, email, role, profileImage, phoneNumber, gender } = req.body;

            // Cek apakah pengguna sudah terdaftar di collection users
            const userRef = await db.collection('users').doc(id).get();
            if (userRef.exists) {
                const userData = userRef.data();
                return res.status(200).json({
                    code: 1,
                    message: 'User already exists',
                    userData: userData
                });
            }

            // Cek apakah pengguna sudah terdaftar di collection consultants
            const consultantRef = await db.collection('consultants').doc(id).get();
            if (consultantRef.exists) {
                return res.status(401).json({
                    code: -1,
                    message: 'You are already registered as a consultant. Please sign in as a consultant.',

                });
            }

            const userData = {
                id,
                username,
                email,
                role,
                profileImage,
                phoneNumber,
                gender,
            };

            await db.collection('users').doc(id).set(userData);

            return res.status(201).json({ code: 1, userData, message: 'Adding user successful' });
        } catch (error) {
            console.error('Error adding user:', error);
            return res.status(500).json({ code: -1, error: 'Internal server error', message: 'Something went wrong' });
        }
    });
});
