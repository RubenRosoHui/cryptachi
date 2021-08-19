const router = require('express').Router();

const bodyParser = require('body-parser');
const controller = require('../controllers/checkout.js');
const validator = require('../validators/checkout.js');
const { needsCaptcha } = require('../middlewares/auth.js');

router.post('/create-invoice', needsCaptcha, validator.createInvoice, controller.createInvoice);

router.post('/webhooks', validator.webhooks, controller.webhooks);

router.get('/check-invoice', controller.checkInvoice)

module.exports = router;
