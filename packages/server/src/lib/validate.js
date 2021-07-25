const { check, body, param, query, oneOf, validationResult } = require('express-validator');
const validator = require('validator');
const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js')

existsOpts = { checkFalsy: true };

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

exports.password = function({ isStrong=false } = { isStrong: false }) {
  const passwordValidator = body('password')
		.exists(existsOpts).withMessage('Password is required.')
    .isString().withMessage('Password must be a string.')
		.isLength({ max: 30 }).withMessage('Password cannot exceed 30 characters');

  if (isStrong) passwordValidator.isStrongPassword().withMessage('Weak Password. Must be a minimum of 8 characters long and contain 1 uppercase, 1 lowercase, 1 number, and 1 symbol.');

  return passwordValidator;
}

exports.confirmPassword = () => body('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) throw "Passwords don't match";
    return true;
  });

exports.alias = function({ checkValueIn='any', checkDomainValueIn='body', requireDomainField=true, allowTaken=false, allowExisting=false, optional=false } = { checkValueIn:'any', checkDomainValueIn:'body', requireDomainField:true, allowExists:false, allowTaken:false, optional:false }) {
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
    .exists().withMessage('Alias field required.')
    .toLowerCase()
    .bail()
    .custom(async (value, {req}) => {
      const aliasFound = await Alias.findOne({ alias: value, domain: req[checkDomainValueIn].domain });

      // Check if alias exists
			if (!allowExisting && aliasFound) throw 'Alias already exists.';

      // Check if alias is taken
      const aliasTaken = Boolean(aliasFound && aliasFound.user);
      if (!allowTaken && aliasTaken) throw 'Alias is taken.';

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
			if (!validator.isFQDN(alias + '.' + value)) return false;
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
