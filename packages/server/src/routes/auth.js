const express = require('express');
const router = express.Router();

router.post('/register');

//USER LOGIN
router.post('/login');

//RESET LINK
router.get('/reset-password');

//RESET PASSWORD
router.post('/reset-password');

module.exports = router;
