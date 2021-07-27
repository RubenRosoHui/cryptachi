const validate = require('../lib/validate.js');

exports.addFreeAlias = [
  validate.alias({ checkValueIn: 'param', checkDomainValueIn: 'query', allowExisting: true }),
  validate.domain({ checkValueIn: 'query', checkAliasValueIn: 'params', requireAliasField: false }),
  validate.checkValidationResults
];

exports.deleteAlias = [
  validate.alias({ checkValueIn: 'param', checkDomainValueIn: 'query', allowTaken: true, allowExisting: true, mustExist: true }),
  validate.domain({ checkValueIn: 'query', checkAliasValueIn: 'params' }),
  validate.checkValidationResults
];

exports.addRecord = [
  validate.alias({ checkValueIn: 'param', checkDomainValueIn: 'body', allowTaken: true, allowExisting: true, mustExist: true }),
  validate.domain({ checkValueIn: 'body', checkAliasValueIn: 'params' }),
  validate.currency(),
  validate.recipientAddress(),
  validate.recipientName(),
  validate.checkValidationResults
];

exports.deleteRecord = [
  validate.alias({ checkValueIn: 'param', checkDomainValueIn: 'body', allowTaken: true, allowExisting: true, mustExist: true }),
  validate.domain({ checkValueIn: 'body', checkAliasValueIn: 'params' }),
  validate.currency({ mustExist: true }),
  validate.checkValidationResults
];
