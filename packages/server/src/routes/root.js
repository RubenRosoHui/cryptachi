const router = require('express').Router();

const controller = require('../controllers/root.js');
const validator = require('../validators/root.js');

router.post('/contact', validator.contact, controller.contact);

module.exports = router;
