const validate = require('../lib/validate.js');
const { check, body, param, query, oneOf,header, validationResult } = require('express-validator');
const crypto = require('crypto')
const errorLib = require('../lib/error.js')

exports.webhooks = [
	//TODO: Validators (doesEmailExist? doesUserOwnAlias? doesPlanExist? ToLowerCase)

	header('btcpay-sig').custom((signature, {req}) => {

		const hmac = crypto.createHmac('sha256',process.env.WEBHOOK_SECRET)
		.update(req.rawbody)
		.digest('hex');

		if(signature != `sha256=${hmac}`){
			console.log('invalid webhook signature')
			throw errorLib.authenticationError('You do not have permission to access this route');
		}
		return true;
	}),
  validate.checkValidationResults
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
