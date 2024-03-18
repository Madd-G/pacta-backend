const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

const db = admin.firestore();

exports.getUserById = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {

        try {
            const userId = req.query.userId; // Retrieve userId from query parameter
    
            console.log('Received userId:', userId); // Log the received userId
    
            // Validasi userId
            if (!userId) {
                return res.status(400).json({ status: 'failed', error: 'Missing userId', message: 'Please provide a userId' });
            }
    
            // Get user dan based on id
            const userDoc = await db.collection('users').doc(userId).get();
    
            if (!userDoc.exists) {
                return res.status(404).json({ status: 'failed', error: 'User not found', message: 'User with the provided userId does not exist' });
            }
    
            const userData = userDoc.data();
    
            return res.status(200).json({ status: 'success', userData: userData });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ status: 'failed', error: 'Internal server error', message: 'Something went wrong' });
        }
    });
});
