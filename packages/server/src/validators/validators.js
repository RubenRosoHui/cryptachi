const { body, param, query, oneOf, validationResult, sanitizeBody } = require('express-validator');
const validator = require('validator');
const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

exports.validateConfirmedAccount = [
	//customer validator that checks the user account for the isEmailConfirmed variable
	body('email').custom(async (value, { req }) => {
		let user = await User.findOne({ email: value });
		if (!user.isEmailConfirmed) {
			throw ErrorLib.authenticationError('User Account Not activated yet');
		}
		return true;
	}),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.authenticationError(errors.array()[0].msg);
			next(e);
		}
		
		next();
	}
]

exports.validateUser = [
	body('email')
    .toLowerCase()
    .isEmail().withMessage('Invalid email address')
    .bail()
		.custom(async (value, { req }) => {
				let user = await User.findOne({ email: value }); // Resource Intensive task
				if (user) {
					throw new Error('User already exists');
				}
				return true;
			}),
	body('password')
		.isLength({ min: 5 }).withMessage("Weak Password")
    .bail()
    .custom((value, { req }) => {
			if (value !== req.body.confirmPassword) {
				throw new Error('Passwords do not match');
			}
			return true;
		}),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.authenticationError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

let aliasDomainValidation = [
	//Is the domain valid?
	body('domain').custom(async (value, { req }) => {
		const validDomains = ['cryptachi.com'];

		const alias = req.params.alias || req.body.alias

		if (validDomains.includes(req.body.domain) && validator.isFQDN(alias + '.' + req.body.domain)) {
			return true;
		}
		else {
			throw new Error();
		}

	}).withMessage('Invalid Domain name'),

	//Does it already exist?
	/*
	body('alias').custom(async (value, { req }) => {
		let alias = await Alias.findOne({ name: req.body.alias });
		if (alias) {
			throw new Error('Alias already exists');
		}
		return true;
	}).withMessage(''),
	*/
]

//Alias can either have a value or be empty
exports.validateRegisterAlias = [
	body('alias').toLowerCase(),
	body('domain').toLowerCase(),

	oneOf([
		body('alias').isEmpty(),
		aliasDomainValidation
	], "Invalid alias/domain parameters"),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unauthorizedAccessError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

//Alias required
exports.validateAddAlias = [
	param('alias')
    .toLowerCase()
    .exists().withMessage('alias undefined'),
	query('domain')
    .toLowerCase()
    .exists().withMessage('domain undefined')
    .custom(async (value, { req }) => {
			const validDomains = ['cryptachi.com'];

			const alias = req.params.alias// || req.body.alias

			if (validDomains.includes(req.query.domain) && validator.isFQDN(alias + '.' + req.query.domain)) {
				return true;
			}
			else {
				throw new Error();
			}
		}).withMessage('Invalid Domain name'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unprocessableEntityError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateDeleteRecord = [
	body('currency')
		.exists().withMessage('No Currency provided')
		.toLowerCase()
    .custom((value, { req }) => {
			const validDomains = ['xmr', 'btc', 'eth'];

			if (validDomains.includes(req.body.currency)) {
				return true;
			}
			else {
				throw new Error('Invalid currency provided');
			}
		}),
	param('alias')
    .exists().withMessage('No Alias provided')
    .toLowerCase(),
	body('domain')
    .exists().withMessage('No Domain provided')
    .toLowerCase(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unprocessableEntityError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateAddRecord = [
	body('currency')
    .exists().withMessage('No Currency provided')
    .toLowerCase()
    .bail()
		.custom(async (value, { req }) => {
			const validDomains = ['xmr', 'btc', 'eth'];

			if (validDomains.includes(req.body.currency)) {

				//does a currency already exist for this alias?
				const user = await User.findById(req.user.id);//.populate("aliases");
				const aliasObject = await Alias.findOne({ alias: req.params.alias, domain: req.body.domain, user: user });

				//if alias exists
				if (aliasObject) {
					//if alias already contains a record for this currency
					if (aliasObject.records.map(record => record.currency).includes(req.body.currency)) {
						throw new Error('A record with this currency already exists')
					}
					else return true;
				}
				else throw new Error('Cannot find alias belonging to user');
			}
			else {
				throw new Error('Invalid currency provided');
			}
		}),

	body('domain')
		.exists().withMessage('No Domain provided')
		.toLowerCase(),

	body('address')
    .exists().withMessage('No Crypto Address provided'),

	param('alias')
		.exists().withMessage('No Alias provided')
		.toLowerCase(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unprocessableEntityError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateDeleteAlias = [
	param('alias')
    .exists().withMessage('alias undefined')
    .toLowerCase(),

	query('domain')
    .exists().withMessage('domain undefined')
    .toLowerCase(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unprocessableEntityError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateQueryAliases = [
	query('domain')
    .exists()
    .toLowerCase()
		.custom(async (value, { req }) => {
			const validDomains = ['cryptachi.com'];

			if (validDomains.includes(req.query.domain)) {
				return true;
			}
			else {
				throw new Error();
			}
		}).withMessage('Invalid Domain name'),
	query('names')
    .exists()
    .toLowerCase(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unprocessableEntityError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]
