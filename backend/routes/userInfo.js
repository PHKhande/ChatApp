const express = require('express');

const userSignUp = require('../controllers/userInfo');

const router = express.Router();

router.post('/signup/user', userSignUp.signUp);

module.exports = router;