const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.js');
const validators = require('../validators/validators.js');

//USER REGISTRATION
router.post('/register',validators.validateUser,validators.validateRegisterAlias,controller.register);

//USER LOGIN
router.post('/login',controller.login);

//RESET LINK
router.get('/reset-password');

//RESET PASSWORD
router.post('/reset-password');

module.exports = router;
