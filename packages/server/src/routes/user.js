const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.js')
const validators = require('../validators/user.js');

router.post('/aliases/:alias/renew', validators.renewAlias, controller.renewAlias);

router.get('/aliases', controller.getAliases);

router.post('/aliases/:alias', validators.addFreeAlias, controller.addFreeAlias);

router.delete('/aliases/:alias', validators.deleteAlias, controller.deleteAlias);

router.post('/aliases/:alias/records', validators.addRecord , controller.addRecord);

router.delete('/aliases/:alias/records', validators.deleteRecord , controller.deleteRecord);

module.exports = router;
