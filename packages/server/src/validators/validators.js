const { body, oneOf, validationResult } = require('express-validator');
const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

exports.validateUser = [
	body('email').isEmail().withMessage('Invalid email address'),
	
	//check if email already exists
	body('email').custom(async (value, { req }) => {
		let user = await User.findOne({ email: value });
		if (user) {
			console.log('User already exists');
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
			let e =ErrorLib.authenticationError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]

exports.validateAlias = [
	oneOf([
		body('alias').isEmpty(),
		body('alias').toLowerCase().isFQDN().contains('cryptachi.com'),
		body('alias').custom( async (value, { req }) => {
			if(req.body.alias + "cryptachi.com")
			if (alias) {
				throw new Error('Alias already exists');
			}
			return true;
		})
	],"Alias is invalid"),

	//Does it already exist?
	body('alias').custom(async (value, { req }) => {
		let alias = await Alias.findOne({ name: req.body.alias });
		if (alias) {
			throw new Error('Alias already exists');
		}
		return true;
	}),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let e =ErrorLib.unauthorizedAccessError(errors.array()[0].msg);
			next(e);
		}
		next();
	}
]
