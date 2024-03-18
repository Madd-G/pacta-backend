const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

const db = admin.firestore();

exports.sendMessage = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const requestData = req.body;

            // Extract data from request body
            const { message_content, message_field } = requestData;
            const { docId, userName, userId, userAvatar, consultantName, consultantId, consultantAvatar, lastSender, lastMessage, messageNotRead, isRead } = message_field;
            const { senderId, content, type } = message_content;

            // Convert time to Firestore Timestamp
            const timeNow = admin.firestore.Timestamp.now();

            // Validate request
            const requiredAttributes = ['docId', 'userId', 'userName', 'userAvatar', 'consultantId', 'consultantName', 'consultantAvatar', 'lastSender', 'lastMessage', 'messageNotRead'];
            const requiredContent = ['senderId', 'content', 'type'];
            const missingAttributes = requiredAttributes.filter(attr => !message_field[attr]);
            const missingContent = requiredContent.filter(attr => !message_content[attr]);

            if (missingAttributes.length > 0) {
                return res.status(400).json({ 
                    status: 'failed', 
                    error: 'Missing attributes', 
                    message: `Please provide all required attributes: ${missingAttributes.join(', ')}` 
                });
            }

            if (missingContent.length > 0) {
                return res.status(400).json({ 
                    status: 'failed', 
                    error: 'Missing content', 
                    message: `Please provide all required content: ${missingContent.join(', ')}` 
                });
            }

            // Add message to the message collection
            const messageData = {
                userName,
                userId,
                userAvatar,
                consultantName,
                consultantId,
                consultantAvatar,
                lastSender,
                time: timeNow,
                lastMessage,
                messageNotRead,
                isRead,
            };
            await db.collection('message').doc(docId).set(messageData); // Set the message document with the specified docId

            // Add message to the messageList collection within the message document
            const messageListData = {
                time: timeNow,
                content,
                type,
                senderId,
            };
            await db.collection('message').doc(docId).collection('messageList').add(messageListData); // Add a new document to the messageList collection within the message document

            return res.status(201).json({ status: 'success', message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({ status: 'failed', error: 'Internal server error', message: 'Something went wrong' });
        }
    });
});
