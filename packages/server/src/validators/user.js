const validate = require('../lib/validate.js');

exports.renewAlias = [
  validate.alias({
    checkValueIn: 'param',
    checkDomainValueIn: 'body',
    allowExisting: true,
    allowTaken: true,
    mustExist: true,
    checkOwnership: true
  }),
  validate.domain({
    checkValueIn: 'body',
    checkAliasValueIn: 'params'
  }),
  validate.checkValidationResults
];

exports.addFreeAlias = [
  validate.alias({
    checkValueIn: 'param',
    checkDomainValueIn: 'query',
    allowExisting: true
  }),
  validate.domain({
    checkValueIn: 'query',
    checkAliasValueIn: 'params',
    requireAliasField: false
  }),
  validate.checkValidationResults
];

exports.deleteAlias = [
  validate.alias({
    checkValueIn: 'param',
    checkDomainValueIn: 'query',
    allowTaken: true,
    allowExisting: true,
    mustExist: true,
    checkOwnership: true
  }),
  validate.domain({
    checkValueIn: 'query',
    checkAliasValueIn: 'params'
  }),
  validate.checkValidationResults
];

exports.addRecord = [
  validate.alias({
    checkValueIn: 'param',
    checkDomainValueIn: 'body',
    allowTaken: true,
    allowExisting: true,
    mustExist: true,
    checkOwnership: true
  }),
  validate.domain({
    checkValueIn: 'body',
    checkAliasValueIn: 'params'
  }),
  validate.currency(),
  validate.recipientAddress(),
  validate.recipientName(),
  validate.description(),
  validate.checkValidationResults
];

exports.deleteRecord = [
  validate.alias({
    checkValueIn: 'param',
    checkDomainValueIn: 'body',
    allowTaken: true,
    allowExisting: true,
    mustExist: true,
    checkOwnership: true
  }),
  validate.domain({
    checkValueIn: 'body',
    checkAliasValueIn: 'params'
  }),
  validate.currency({
    allowExisting: true,
    mustExist: true
  }),
  validate.checkValidationResults
];

exports.editRecord = [
  validate.alias({
    checkValueIn: 'param',
    checkDomainValueIn: 'body',
    allowTaken: true,
    allowExisting: true,
    mustExist: true,
    checkOwnership: true
  }),
  validate.domain({
    checkValueIn: 'body',
    checkAliasValueIn: 'params'
  }),
  validate.currency({
    allowExisting: true,
    mustExist: true
  }),
  validate.recipientAddress(),
  validate.recipientName(),
  validate.description(),
  validate.checkValidationResults
];

exports.changePassword = [
  validate.oldPassword(),
  validate.password(),
  validate.confirmPassword(),
  validate.checkValidationResults
]
