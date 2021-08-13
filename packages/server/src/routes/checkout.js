const router = require('express').Router();

const bodyParser = require('body-parser');
const controller = require('../controllers/checkout.js');
const validator = require('../validators/checkout.js');

router.post('/create-invoice',validator.createInvoice, controller.createInvoice)

router.post('/webhooks', validator.webhooks, controller.webhooks)

module.exports = router;
