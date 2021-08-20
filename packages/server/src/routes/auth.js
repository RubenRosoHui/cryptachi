const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.js');
const validators = require('../validators/auth.js');
const { needsCaptcha } = require('../middlewares/auth.js');

router.post('/register', validators.register, controller.register);

router.post('/login', needsCaptcha, validators.login, controller.login);

router.post('/confirm-email', validators.confirmEmail, controller.confirmEmail)

router.get('/reset', validators.getResetLink, controller.getResetLink);

router.post('/reset', validators.postResetPassword, controller.postResetPassword);

module.exports = router;
