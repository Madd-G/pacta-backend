const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

const db = admin.firestore();

exports.updateProfile = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { id, email, username, role, profileImage, phoneNumber, gender } = req.body; // Extract updated fields from request body

            // Check if id is provided
            if (!id) {
                return res.status(400).json({ code: 0, error: 'Missing user id', message: 'Please provide a user id' });
            }

            // Update user document
            const userRef = db.collection('users').doc(id);

            // Update only provided fields
            const updateData = {};
            if (email !== undefined) updateData.email = email;
            if (role !== undefined) updateData.role = role;
            if (profileImage !== undefined) updateData.profileImage = profileImage;
            if (username !== undefined) updateData.username = username;
            if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
            if (gender !== undefined) updateData.gender = gender;

            await userRef.update(updateData);

            // Retrieve updated user data
            const userDoc = await userRef.get();
            const userData = userDoc.data();

            return res.status(200).json({ code: 1, userData, message: 'Updating user successful' });
        } catch (error) {
            console.error('Error editing profile:', error);
            return res.status(500).json({ code: 0, error: 'Internal server error', message: 'Something went wrong' });
        }
    });
});
