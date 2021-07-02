const express = require('express');
const router = express.Router();

//QUERY ALIAS
router.get('/');

//ADD ALIAS
router.post('/');

//REMOVE ALIAS
router.delete('/');

// ADD ALIAS RECORD
router.post('/:name');

//REMOVE ALIAS RECORD
router.delete('/:name');

module.exports = router;
