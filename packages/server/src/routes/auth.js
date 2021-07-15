const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.js');
const validators = require('../validators/validators.js');

//USER REGISTRATION
router.post('/register',validators.validateUser,validators.validateRegisterAlias,controller.register);

//USER ACCOUNT ACTIVATION
//register/:token?email=something@something.com
router.get('/register/:token',controller.verifyUser)

//USER LOGIN
router.post('/login',controller.login);

router.post('/login/:token',controller.verifyUser)


//RESET LINK
router.get('/reset',controller.resetPasswordGet);

//RESET PASSWORD
//reset/:token?email=something@something.com
router.post('/reset/:token',controller.resetPasswordPost);

module.exports = router;
