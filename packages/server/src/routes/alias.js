const express = require('express');
const router = express.Router();
const controller = require('../controllers/alias.js')
const authMiddleWare = require('../middlewares/auth.js')
const validators = require('../validators/validators.js');

//QUERY ALIAS
router.get('/', validators.validateQueryAliases,controller.queryAliases);

module.exports = router;
