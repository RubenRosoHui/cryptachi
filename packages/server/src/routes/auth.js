const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.js');
const validators = require('../validators/auth.js');

router.post('/register', validators.register, controller.register);

router.post('/login', validators.login, controller.login);

router.post('/login/:token', validators.confirmEmail, controller.confirmEmail)

router.get('/reset', validators.getResetLink, controller.getResetLink);

router.post('/reset/:token', validators.postResetPassword, controller.postResetPassword);

module.exports = router;
