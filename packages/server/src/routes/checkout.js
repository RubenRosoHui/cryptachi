const router = require('express').Router();

const bodyParser = require('body-parser');
const controller = require('../controllers/checkout.js');
const validator = require('../validators/checkout.js');

router.post('/create-invoice', controller.createInvoice)

router.post('/webhooks/test', validator.webhooks, controller.test)

module.exports = router;
