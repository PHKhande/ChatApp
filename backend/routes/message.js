const express = require('express');

const messageController = require('../controllers/message');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/user/message', authenticate.authentication, messageController.postSendMessage);

module.exports = router;