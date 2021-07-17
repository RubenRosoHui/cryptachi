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
	body('email').toLowerCase(),
	body('email').isEmail().withMessage('Invalid email address'),

	//check if email already exists
	body('email').custom(async (value, { req }) => {
		let user = await User.findOne({ email: value });
		if (user) {
			throw new Error('User already exists');
		}
		return true;
	}),

	//check if passwords match
	body('password').custom((value, { req }) => {
		if (value !== req.body.confirmPassword) {
			throw new Error('Passwords do not match');
		}
		return true;
	}),

	body('password').isLength({ min: 5 }).withMessage("Weak Password"),

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
	param('alias').exists().withMessage('alias undefined'),
	query('domain').exists().withMessage('domain undefined'),
	param('alias').toLowerCase(),
	query('domain').toLowerCase(),

	query('domain').custom(async (value, { req }) => {
		const validDomains = ['cryptachi.com'];

		const alias = req.params.alias// || req.body.alias

		if (validDomains.includes(req.query.domain) && validator.isFQDN(alias + '.' + req.query.domain)) {
			return true;
		}
		else {
			throw new Error();
		}

	}).withMessage('Invalid Domain name'),

	//aliasDomainValidation,

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unauthorizedAccessError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateDeleteRecord = [
	body('currency').toLowerCase(),
	param('alias').toLowerCase(),
	body('domain').toLowerCase(),
	body('currency').exists().withMessage('No Currency provided'),
	body('domain').exists().withMessage('No Domain provided'),
	param('alias').exists().withMessage('No Alias provided'),

	body('currency').custom(async (value, { req }) => {
		const validDomains = ['xmr', 'btc', 'eth'];

		if (validDomains.includes(req.body.currency)) {
			return true;
		}
		else {
			throw new Error('Invalid currency provided');
		}
	}),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unauthorizedAccessError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateAddRecord = [
	body('currency').toLowerCase(),
	param('alias').toLowerCase(),
	body('domain').toLowerCase(),
	body('currency').exists().withMessage('No Currency provided'),
	body('domain').exists().withMessage('No Domain provided'),
	body('address').exists().withMessage('No Crypto Address provided'),
	param('alias').exists().withMessage('No Alias provided'),

	//Is Currency valid?
	body('currency').custom(async (value, { req }) => {
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

	//Is a valid crypto address?


	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unauthorizedAccessError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateDeleteAlias = [
	param('alias').exists().withMessage('alias undefined'),
	query('domain').exists().withMessage('domain undefined'),
	param('alias').toLowerCase(),
	query('domain').toLowerCase(),


	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unauthorizedAccessError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateQueryAliases = [
	query('domain').exists(),
	query('names').exists(),
	query('domain').toLowerCase(),
	query('names').toLowerCase(),

	//test if each given name results in a FQDN?


	query('domain').custom(async (value, { req }) => {
		const validDomains = ['cryptachi.com'];

		if (validDomains.includes(req.query.domain)) {
			return true;
		}
		else {
			throw new Error();
		}
	}).withMessage('Invalid Domain name'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e = ErrorLib.unauthorizedAccessError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

