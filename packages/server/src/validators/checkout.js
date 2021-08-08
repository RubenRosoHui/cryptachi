const validate = require('../lib/validate.js');
const { check, body, param, query, oneOf,header, validationResult } = require('express-validator');
const crypto = require('crypto')

exports.webhooks = [
	header('btcpay-sig').custom((signature, {req}) => {

		const hmac = crypto.createHmac('sha256',process.env.WEBHOOK_SECRET)
		.update(req.rawbody)
		.digest('hex');

		if(signature != `sha256=${hmac}`){
			console.log('invalid webhook signature')
			throw errorLib.authenticationError('You do not have permission to access this route');
		}
		return true;
	})

]

exports.postPaymentIntent = [
  validate.alias({
    checkValueIn: 'body',
    checkDomainValueIn: 'body',
    mustExist: true
  }),
  validate.domain({ checkValueIn: 'body', checkAliasValueIn: 'body' }),
  validate.plan(),
  validate.paymentCurrency(),
  validate.paymentPrice(),
  validate.paymentUnit(),
  validate.checkValidationResults
];
