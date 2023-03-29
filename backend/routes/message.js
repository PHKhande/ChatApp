const express = require('express');

const messageController = require('../controllers/message');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/user/message', authenticate.authentication, messageController.postSendMessage);

router.get('/messages', authenticate.authentication, messageController.getAllMessages);

module.exports = router;