const express = require('express');
const router = express.Router();
const controller = require('../controllers/alias.js')
const authMiddleWare = require('../middlewares/auth.js')

//QUERY ALIAS
router.get('/',controller.queryAliases);

//GET ALIASES OF A USER
//NEED TO MOVE THE LOCATION OF THIS
//router.get('/',authMiddleWare.validateWebToken,controller.getAliases)

//ADD ALIAS
// router.post('/',authMiddleWare.validateWebToken,controller.addAlias);
//router.post('/',authMiddleWare.validateWebToken,controller.addAlias);
router.post('/:name',authMiddleWare.validateWebToken,controller.addAlias);

//REMOVE ALIAS
router.delete('/:name',authMiddleWare.validateWebToken,controller.deleteAlias);

// ADD ALIAS RECORD
router.post('/:name/records',authMiddleWare.validateWebToken,controller.addRecord);

//REMOVE ALIAS RECORD
router.delete('/:name/records',authMiddleWare.validateWebToken,controller.deleteRecord);

module.exports = router;
