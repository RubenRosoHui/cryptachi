const validate = require('../lib/validate.js');

exports.queryAliases = [
  validate.domain({ checkValueIn: 'query', requireAliasField: false }),
  validate.aliasList(),
	validate.email({
		checkValueIn: 'query',
		optional: true
	}),
  validate.checkValidationResults
];
