const express = require('express');
const router = express.Router();
const controller = require('../controllers/alias.js')
const authMiddleWare = require('../middlewares/auth.js')

//QUERY ALIAS
router.get('/');

//ADD ALIAS
// router.post('/',authMiddleWare.validateWebToken,controller.addAlias);
router.post('/',authMiddleWare.validateWebToken,controller.addAlias);

//REMOVE ALIAS
router.delete('/',authMiddleWare.validateWebToken,controller.deleteAlias);

// ADD ALIAS RECORD
router.post('/:name');

//REMOVE ALIAS RECORD
router.delete('/:name');

module.exports = router;
