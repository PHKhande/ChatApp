const express = require('express');

const userSignUp = require('../controllers/userInfo');

const router = express.Router();

router.post('/signup/user', userSignUp.signup);

router.post('/login/user', userSignUp.login);

// router.post('/password/forgotpassword', FPassword.getResetEmailInfo);

// router.get('/password/resetpassword/:resetId', FPassword.getResetlinkInfo);

// router.post('/password/resetpassword/:resetId', FPassword.postResetPasswordInfo);

module.exports = router;