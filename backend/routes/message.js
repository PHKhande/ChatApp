const express = require('express');

const multer = require('multer');
const upload = multer();

const messageController = require('../controllers/message');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/user/message', authenticate.authentication, messageController.postSendMessage);

router.get('/messages', authenticate.authentication, messageController.getAllMessages);

router.post('/sendFile/:groupId' , authenticate.authentication, upload.single('file'), messageController.sendFile);

module.exports = router;