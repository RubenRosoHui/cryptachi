const validate = require('../lib/validate.js');

exports.login = [
  validate.email({ checkValueIn: 'body' }),
  validate.password(),
  validate.checkValidationResults
];

exports.register = [
  validate.email({ checkValueIn: 'body', checkExisting: false, checkTaken: true }),
  validate.password({ isStrong: true }),
  validate.confirmPassword(),
  validate.alias({ checkValueIn: 'body', optional: true }),
  validate.domain({ checkValueIn: 'body', optional: true }),
  validate.checkValidationResults
];

exports.confirmEmail = [
  validate.email({ checkValueIn: 'query' }),
  validate.emailConfirmedToken(),
  validate.checkValidationResults
];

exports.getResetLink = [
  validate.email({ checkValueIn: 'query' }),
  validate.checkValidationResults
];

exports.postResetPassword = [
  validate.email({ checkValueIn: 'body' }),
  validate.password({ isStrong: true }),
  validate.confirmPassword(),
  validate.resetPasswordToken(),
  validate.checkValidationResults
];
