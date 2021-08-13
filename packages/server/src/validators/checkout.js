const validate = require('../lib/validate.js');
const { check, body, param, query, oneOf, header, validationResult } = require('express-validator');
const crypto = require('crypto')
const errorLib = require('../lib/error.js')
const Alias = require('../models/alias.js');
const User = require('../models/user.js');
const Invoice = require('../models/invoice.js');

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
	validate.plan(),
	body('alias').custom(async (alias, { req }) => {

		const userObject = await User.findOne({ email: req.body.email });
		const aliasObject = await Alias.findOne({ alias: alias, domain: req.body.domain }).populate("invoice");

		if (aliasObject) {
			if (aliasObject.user && !aliasObject.user.equals(userObject._id)) {
				throw errorLib.badRequestError('alias is owned by someone already');
			}
			if (aliasObject.paid) {
				if (Date.now() < aliasObject.expiration.valueOf() - (86400000 * 60)) {
					throw errorLib.conflictError('you cannot renew yet');
				}
			}
			if (aliasObject.invoice && !aliasObject.invoice.user.equals(userObject._id)) {
				throw errorLib.conflictError('someone is currently buying this!');
			}
		}
		return true
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
	body('invoiceId').custom(async (invoiceId, { req }) => {

		//list of states that cannot preceed the state specified on the request
		// "invoiceProcessing cannot come after Settled,Invalid,etc"
		const invalidConditions = {
			InvoiceProcessing: ['InvoiceSettled','InvoiceInvalid','InvoiceExpired','InvoiceProcessing'],
			InvoiceExpired: ['InvoiceSettled','InvoiceInvalid','InvoiceExpired'],
			InvoiceInvalid: ['InvoiceSettled','InvoiceInvalid'],
			InvoiceSettled: ['InvoiceSettled','InvoiceInvalid']
		}

		const invoice = await Invoice.findOne({ invoiceId: invoiceId });
		if (!invoice) {
			console.log('This invoice was created improperly')
			throw errorLib.badRequestError('This invoice was created improperly')
		}
		if (invalidConditions[req.body.type] && invalidConditions[req.body.type].includes(invoice.state)) {//invalidStates.includes(invoice.state)) {
			console.log('Invalid state sent to webhook')
			throw errorLib.badRequestError('The invoice has already received this information')
		}

		return true;
	}),
	validate.checkValidationResults
]