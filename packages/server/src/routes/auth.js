const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.js');
const validators = require('../validators/validators.js');

const { body, validationResult } = require('express-validator');

//USER REGISTRATION
router.post('/register',validators.validateUser,validators.validateAlias,controller.register);
//body('email').isEmail(),body('password').isLength({ min: 5 })

//USER LOGIN
router.post('/login');

//RESET LINK
router.get('/reset-password');

//RESET PASSWORD
router.post('/reset-password');

module.exports = router;
