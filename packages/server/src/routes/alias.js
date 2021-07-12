const express = require('express');
const router = express.Router();
const controller = require('../controllers/alias.js')
const authMiddleWare = require('../middlewares/auth.js')
const validators = require('../validators/validators.js');

//QUERY ALIAS
router.get('/', validators.validateQueryAliases,controller.queryAliases);

//ADD ALIAS
router.post('/:alias', authMiddleWare.validateWebToken, validators.validateAlias, controller.addAlias);

//REMOVE ALIAS
router.delete('/:alias', authMiddleWare.validateWebToken, validators.validateDeleteAlias, controller.deleteAlias);

// ADD ALIAS RECORD
router.post('/:alias/records', authMiddleWare.validateWebToken, validators.validateAddRecord, controller.addRecord);

//REMOVE ALIAS RECORD
router.delete('/:alias/records', authMiddleWare.validateWebToken, validators.validateDeleteRecord, controller.deleteRecord);

module.exports = router;
