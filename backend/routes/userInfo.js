const express = require('express');

const userSignUp = require('../controllers/userInfo');

const router = express.Router();

router.post('/signup/user', userSignUp.signup);

router.post('/login/user', userSignUp.login);

module.exports = router;