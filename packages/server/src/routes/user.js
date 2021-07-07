const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.js')
const authMiddleWare = require('../middlewares/auth.js')

//GET ALIASES OF A USER
router.get('/',authMiddleWare.validateWebToken,controller.getAliases);

module.exports = router;
