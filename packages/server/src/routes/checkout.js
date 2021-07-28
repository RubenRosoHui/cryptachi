const router = require('express').Router();

const controller = require('../controllers/checkout.js');
const validator = require('../validators/checkout.js');

router.post('/payment-intent', validator.postPaymentIntent, controller.postPaymentIntent);

//router.post('/purchase', controller.postPurchase);

module.exports = router;
