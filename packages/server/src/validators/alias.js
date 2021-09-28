const validate = require('../lib/validate.js');

exports.queryAliases = [
	validate.domain({ checkValueIn: 'query', requireAliasField: false }),
	validate.aliasList(),
	validate.email({
		checkValueIn: 'query',
		optional: true,
		checkFalsy: true
	}),
	validate.checkValidationResults
];

exports.queryAddresses = [
	validate.domain({ checkValueIn: 'query', requireAliasField: false, checkAliasValueIn: 'query' }),
	validate.alias({ checkValueIn: 'query', checkDomainValueIn: 'query', allowTaken: true, mustBeTaken: true, allowExisting: true, mustExist: true }),

	validate.checkValidationResults
];
