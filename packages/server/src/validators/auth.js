const { param } = require('express-validator');
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
  validate.email(),
  validate.emailConfirmedToken(),
  validate.checkValidationResults
];

exports.getResetLink = [
  validate.email(),
  validate.checkValidationResults
];

exports.postResetPassword = [
  validate.email(),
  validate.password({ isStrong: true }),
  validate.confirmPassword(),
  validate.resetPasswordToken(),
  validate.checkValidationResults
];
