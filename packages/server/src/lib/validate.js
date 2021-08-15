const { check, body, param, query, oneOf, validationResult } = require('express-validator');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js')

const existsOpts = { checkFalsy: true };

const customValidationResult = validationResult.withDefaults({
	formatter: error => {
		if (typeof error.msg === 'object') {
			return {
				...error,
				type: error.msg.type,
				msg: error.msg.msg
			};
		} else {
			return error;
		}
	},
});

exports.checkValidationResults = (req, _, next) => {
	const validationResults = customValidationResult(req);

	if (validationResults.isEmpty()) return next();

	const validationError = validationResults.array()[0];

	if (validationError.type) {
		next(errorLib[validationError.type](validationError.msg));
	} else {
		next(errorLib.unprocessableEntityError(validationError.msg));
	}
};

exports.email = function({ checkValueIn='any', checkTaken=false, checkExisting=true } = { checkValueIn: 'any', checkTaken:false, checkExisting:true }) {
  const defaultMessage = value => `Invalid email: ${value}`;
  let emailValidator;

  switch(checkValueIn) {
		case 'body':
      emailValidator = body('email', defaultMessage);
      break;
    case 'query':
      emailValidator = query('email', defaultMessage);
      break;
    case 'param':
      emailValidator = param('email', defaultMessage);
      break;
    default:
      emailValidator = check('email', defaultMessage);
      break;
  }

  emailValidator
		.exists(existsOpts).withMessage('Email is required')
		.toLowerCase()
		.isEmail()
    .bail()
    .custom(async value => {
			const userFound = await User.findOne({ email: value });

      if (checkTaken && userFound) {
				throw { type: 'conflictError', msg: 'Email is taken.' };
      }

      if (checkExisting && !userFound) {
				throw { type: 'notFoundError', msg: 'Email does not exist.' };
      }

			return true;
    });

  return emailValidator;
}

exports.password = function({ isStrong=false } = { isStrong:false }) {
  const passwordValidator = body('password')
		.exists(existsOpts).withMessage('Password is required.')
    .isString().withMessage('Password must be a string.')
    .trim()
		.isLength({ max: 100 }).withMessage('Password cannot exceed 100 characters');

  if (isStrong) passwordValidator.isStrongPassword().withMessage('Weak Password. Must be a minimum of 8 characters long and contain 1 uppercase, 1 lowercase, 1 number, and 1 symbol.');

  return passwordValidator;
}

exports.confirmPassword = () => body('confirmPassword')
  .exists(existsOpts).withMessage('Confirm Password is required.')
  .custom((value, { req }) => {
    if (value !== req.body.password) throw "Passwords don't match";
    return true;
  });

exports.alias = function({ checkValueIn='any', checkDomainValueIn='body', requireDomainField=true, allowTaken=false, allowExisting=false, optional=false, mustExist=false, checkOwnership=false } = { checkValueIn:'any', checkDomainValueIn:'body', requireDomainField:true, allowExists:false, allowTaken:false, optional:false, mustExist:false, checkOwnership:false }) {
  const defaultMessage = value => `Invalid alias: ${value}`;
  let aliasValidator;

  switch(checkValueIn) {
		case 'body':
      aliasValidator = body('alias', defaultMessage);
      break;
    case 'query':
      aliasValidator = query('alias', defaultMessage);
      break;
    case 'param':
      aliasValidator = param('alias', defaultMessage);
      break;
    default:
      aliasValidator = check('alias', defaultMessage);
      break;
  }

  if (optional) aliasValidator.optional();

  if (requireDomainField) {
		aliasValidator.custom((_, {req}) => {
			const domain = req[checkDomainValueIn].domain;
			if (!domain) throw 'Domain field required when alias is provided.';
			return true;
		}).bail();
  }

  aliasValidator
    .exists(existsOpts).withMessage('Alias field required.')
		.trim()
    .isAlphanumeric().withMessage('Alias can only contain numbers or letters.')
    .toLowerCase()
    .bail()
    .custom(async (value, {req}) => {
      const aliasFound = await Alias.findOne({ alias: value, domain: req[checkDomainValueIn].domain });

      // Check if alias exists
			if (!allowExisting && aliasFound) throw 'Alias already exists.';

      // Alias must exist
			if (mustExist && !aliasFound) throw 'Alias does not exist.';

      // Check if alias is taken
      const aliasTaken = Boolean(aliasFound && aliasFound.user);
      if (!allowTaken && aliasTaken) throw 'Alias is taken.';

      return true;
    })
    .bail()
    .if(() => checkOwnership)
		// REVIEW: This could be done in the first custom function
    .custom(async (value, {req}) => {
      if (!req.user) {
        console.error('Unable to check ownership since req.user was not found.');
        throw { type: 'ServerError', msg: 'Something went wrong. If you are the admin, check the server logs.' };
      }

      const aliasFound = await Alias.findOne({ alias: value, domain: req[checkDomainValueIn].domain, user: req.user.id });

      if (!aliasFound) throw errorLib.authenticationError('You do not own this alias.');

      return true;
    });

	return aliasValidator;
};

exports.domain = function({ checkValueIn='any', checkAliasValueIn='body', requireAliasField=true, optional=false } = {  checkValueIn:'any', checkAliasValueIn:'body', requireAliasField:true, optional:false  }) {
	let validDomains;
	if (process.env.NODE_ENV === 'development') {
		validDomains = ['cryptachi.com', 'cryptachitest.com'];
	} else {
		// TODO: Populate with purchased domains from DNSimple.
		validDomains = [];
	}

  const defaultMessage = value => `Invalid domain: ${value}`;
  let domainValidator;

  switch(checkValueIn) {
		case 'body':
      domainValidator = body('domain', defaultMessage);
      break;
    case 'query':
      domainValidator = query('domain', defaultMessage);
      break;
    case 'param':
      domainValidator = param('domain', defaultMessage);
      break;
    default:
      domainValidator = check('domain', defaultMessage);
      break;
  }

  if (optional) domainValidator.optional();

  if (requireAliasField) {
		domainValidator.custom((_, {req}) => {
			const alias = req[checkAliasValueIn].alias;
			if (!alias) throw 'Alias field required when domain is provided.';
			return true;
		}).bail();
  }

  domainValidator
    .exists(existsOpts).withMessage('Domain field required.')
    .trim()
    .toLowerCase()
    .isIn(validDomains)

		// NOTE: Do a check if alias field exists since the following validation chains require it.
		.if((_, {req}) => {
			const alias = req[checkAliasValueIn].alias;
      if (alias) return true;
      return false;
    })
    .custom(async (value, {req}) => {
			const alias = req[checkAliasValueIn].alias;
      const fqdn = alias + '.' + value;
			if (!validator.isFQDN(fqdn)) throw `Not a valid FQDN: ${fqdn}`;
			return true;
		});

  return domainValidator;
}

exports.emailConfirmedToken = () => query('token')
  .exists(existsOpts).withMessage('Token is required.')
  .bail()
  .custom(async value => {
    const user = await User.findOne({ isEmailConfirmedToken: value });

    if (!user) throw 'Invalid token.';

    if (user.isEmailConfirmed) throw 'Email is already confirmed.';

    return true;
  });

exports.resetPasswordToken = () => body('token')
  .exists(existsOpts).withMessage('Token is required.')
  .bail()
  .custom(async (value, {req}) => {
    const user = await User.findOne({
      email: req.body.email,
      resetToken: value,
      resetTokenExpiration: {$gt: Date.now()}
    });

    if (!user) throw 'Invalid token.';

    return true;
  });

exports.currency = function({ allowExisting=false, mustExist=false } = { allowExisting:false, mustExist:false }) {
  const validCurrencies = ['xmr', 'btc', 'eth'];

  const currencyValidator = body('currency', value => `Invalid currency: ${value}`);

  currencyValidator
    .exists(existsOpts).withMessage('Currency is required')
    .trim()
    .toLowerCase()
    .isIn(validCurrencies)
    .bail()
    .custom(async (value, {req}) => {
      const alias = await Alias.findOne({
        alias: req.params.alias,
        domain: req.body.domain
      });

      const currencyExists = alias.records.some(record => record.currency === value);

      if (!allowExisting && currencyExists) throw `This alias already has an existing record for ${value}. Please choose another currency.`;

      if (mustExist && !currencyExists) throw `This alias does not have the record: ${value}`;

      return true;
    });

  return currencyValidator;
};

exports.recipientAddress = () => body('recipientAddress', value => `Invalid recipient address: ${value}`)
  .exists(existsOpts).withMessage('Recipient address required.')
  .isString()
  .trim()
  .isLength({ Max: 150 }).withMessage('Recipient Address cannot be longer than 150 characters.');

exports.recipientName = () => body('recipientName', value => `Invalid recipient name: ${value}`)
  .optional()
	.isString()
  .trim()
  .isLength({ Max: 50 }).withMessage('Recipient Address cannot be longer than 50 characters.');

exports.aliasList = () => query('names')
  .exists(existsOpts).withMessage('Names field is required.')
  .toLowerCase()
  .trim(' ,'); // Trims both whitespaces and commas

exports.plan = () => body('plan', value => `Invalid plan: ${value}`)
  .exists(existsOpts).withMessage('Plan field is required.')
  .isString()
  .isIn(['oneYear', 'twoYear', 'threeYear', 'fourYear', 'fiveYear']);

exports.paymentUnit = () => body('payment.unit', value => `Invalid payment unit: ${value}`)
  .exists(existsOpts).withMessage('Payment unit is required.')
  .custom((value, {req}) => {
    const denominationMapping = {
      'xmr': 'piconero',
      'btc': 'satoshi',
      'eth': 'wei'
    };

    const currency = req.body.payment.currency;
    const smallestDenomination = denominationMapping[currency];

    const denomIsValid = value === smallestDenomination;
    if (!denomIsValid) throw `Invalid denomination: ${value}. Valid denomination for ${currency} is ${smallestDenomination}.`;

    return true;
  });

exports.paymentPrice = () => body('payment.price')
  .exists(existsOpts).withMessage('Payment price is required.')
  .isInt().withMessage('Payment price must be an integer.')
  .toInt()

exports.paymentCurrency = () => body('payment.currency', value => `Not a valid currency: ${value}`)
  .exists(existsOpts).withMessage('Payment currency is required.')
  .isString()
  .toLowerCase()
  .isIn(['btc', 'xmr', 'eth'])

exports.name = () => body('name')
  .exists(existsOpts).withMessage('Name field required.')
  .isString()
  .trim()
  .isAlpha('en-US', { ignore: ' ' }).withMessage('Name can only contain alphabetic characters.')
  .isLength({ max: 30 }).withMessage('Name cannot exceed 30 characters.');

exports.phone = () => body('phone', value => `Not a valid phone: ${value}`)
  .optional({ checkFalsy: true })
  .trim()
  .isMobilePhone();

exports.message = () => body('message')
  .exists(existsOpts).withMessage('Message field required.')
  .trim()
  .isLength({ max: 800 }).withMessage('Message cannot exceed 800 characters.')
  .escape();

exports.description = () => body('description')
  .optional()
  .trim()
  .isLength({ max: 50 }).withMessage('Description cannot exceed 50 characters.');

exports.oldPassword = () => body('oldPassword')
  .exists(existsOpts).withMessage('Old password is required.')
  .trim()
  .isLength({ max: 100 }).withMessage('Old password cannot exceed 100 characters.')
  .bail()
  .custom(async (value, {req}) => {
    const user = await User.findById(req.user.id);

    if (!user) throw { type: 'notFoundError', msg: 'User not found.' };

    const passwordsMatch = await bcrypt.compare(value, user.password);
    if (!passwordsMatch) throw { type: 'unprocessableEntityError', msg: 'Old password is invalid.' };

    return true;
  });
