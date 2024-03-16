const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

exports.getConsultants = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {

        try {
            const snapshot = await admin.firestore().collection('consultants').get();
            const consultantsData = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                const consultant = {
                    id: doc.id,
                    email: data.email || '',
                    profileImage: data.profileImage || '',
                    role: data.role || '',
                    username: data.username || ''
                };
                consultantsData.push(consultant);
            });

            return res.status(200).json({ consultants: consultantsData });
        } catch (error) {
            console.error('Error getting consultants:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});
