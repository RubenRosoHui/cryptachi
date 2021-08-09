const validate = require('../lib/validate.js');
const { check, body, param, query, oneOf, header, validationResult } = require('express-validator');
const crypto = require('crypto')
const errorLib = require('../lib/error.js')

exports.createInvoice = [
	validate.alias({
		checkValueIn: 'body',
		checkDomainValueIn: 'body',
		mustExist: false,
		allowExisting: true,
		requireDomainField: true,
		allowTaken: true
	}),
	validate.email({
		checkValueIn: 'body',
		checkExisting: true,
	}),
	validate.domain({
		checkValueIn: 'body',
		requireAliasField: true
	}),

	validate.checkValidationResults
]

exports.webhooks = [
	header('btcpay-sig').custom((signature, { req }) => {

		const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
			.update(req.rawbody)
			.digest('hex');

		if (signature != `sha256=${hmac}`) {
			console.log('invalid webhook signature')
			throw errorLib.authenticationError('You do not have permission to access this route');
		}
		return true;
	}),
	validate.checkValidationResults
]