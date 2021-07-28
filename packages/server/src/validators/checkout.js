const validate = require('../lib/validate.js');

exports.postPaymentIntent = [
  validate.alias({
    checkValueIn: 'body',
    checkDomainValueIn: 'body',
    mustExist: true
  }),
  validate.domain({ checkValueIn: 'body', checkAliasValueIn: 'body' }),
  validate.plan(),
  validate.paymentCurrency(),
  validate.paymentPrice(),
  validate.paymentUnit(),
  validate.checkValidationResults
];
