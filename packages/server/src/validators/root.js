const validate = require('../lib/validate.js');

exports.contact = [
  validate.email({ checkValueIn: 'body', checkExisting: false }),
  validate.name(),
  validate.phone(),
  validate.message(),
  validate.checkValidationResults
];
