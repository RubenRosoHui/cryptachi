const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.js')
const authMiddleWare = require('../middlewares/auth.js')
const validators = require('../validators/validators.js');

//GET ALIASES OF A USER
router.get('/aliases',controller.getAliases);

//ADD ALIAS
router.post('/aliases/:alias', validators.validateAddAlias, controller.addAlias);

//REMOVE ALIAS
router.delete('/aliases/:alias', validators.validateDeleteAlias, controller.deleteAlias);

// ADD ALIAS RECORD
router.post('/aliases/:alias/records', validators.validateAddRecord, controller.addRecord);

//REMOVE ALIAS RECORD
router.delete('/aliases/:alias/records', validators.validateDeleteRecord, controller.deleteRecord);


module.exports = router;
