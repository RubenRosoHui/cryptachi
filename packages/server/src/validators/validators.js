const { body, oneOf, validationResult } = require('express-validator');
const User = require('../models/user.js');
const Alias = require('../models/alias.js');

exports.validateUser = [
	body('email').isEmail(),

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
			throw new Error('Password confirmation does not match password');
		}
		return true;
	}),

	body('password').isLength({ min: 5 }),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });
		next();
	}
]

exports.validateAlias = [
	oneOf([
		body('alias').isEmpty(),
		body('alias').isFQDN().contains('cryptachi.com')
	]),

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
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });
		next();
	}
]
