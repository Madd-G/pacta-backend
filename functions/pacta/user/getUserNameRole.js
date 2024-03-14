const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.getUserNameRole = functions.https.onRequest(async (req, res) => {
    try {
        const usersCollection = admin.firestore().collection('users');
        const snapshot = await usersCollection.get();

        const users = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.role && data.role !== 'owner') {
                const user = {
                    id: doc.id,
                    username: data.username || '',
                    role: data.role || '',
                    fcmToken: data.fcmToken || '',
                };
                users.push(user);
            }
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        return res.status(500).send('Error getting users: ' + error.message);
    }
});
