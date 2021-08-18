const router = require('express').Router();

const controller = require('../controllers/root.js');
const validator = require('../validators/root.js');
const { needsCaptcha } = require('../middlewares/auth.js');

router.post('/contact', needsCaptcha, validator.contact, controller.contact);

module.exports = router;
