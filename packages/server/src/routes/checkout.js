const router = require('express').Router();

const controller = require('../controllers/checkout.js');
const validator = require('../validators/checkout.js');

router.post('/create-invoice', controller.createInvoice)

router.post('/webhooks/invoice-settled',controller.invoiceSettled)
router.post('/webhooks/invoice-processing', controller.invoiceProcessing)
router.post('/webhooks/invoice-expired',controller.invoiceExpired)
router.post('/webhooks/invoice-invalid',controller.invoiceInvalid)

module.exports = router;
