const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.js')
const validators = require('../validators/user.js');

//GET ALIASES OF A USER
router.get('/aliases', controller.getAliases);

//ADD ALIAS
router.post('/aliases/:alias', validators.addFreeAlias, controller.addFreeAlias);

//REMOVE ALIAS
router.delete('/aliases/:alias', validators.deleteAlias, controller.deleteAlias);

// ADD ALIAS RECORD
router.post('/aliases/:alias/records', validators.addRecord , controller.addRecord);

//REMOVE ALIAS RECORD
router.delete('/aliases/:alias/records', validators.deleteRecord , controller.deleteRecord);


module.exports = router;
