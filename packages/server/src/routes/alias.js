const express = require('express');
const router = express.Router();

const controller = require('../controllers/alias.js');
const validators = require('../validators/alias.js');

//QUERY ALIAS
router.get('/', validators.queryAliases, controller.queryAliases);

//Get aliases addresses
router.get('/addresses', validators.queryAddresses, controller.queryAddresses)

module.exports = router;
