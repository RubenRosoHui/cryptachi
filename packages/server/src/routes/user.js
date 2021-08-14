const express = require('express');
const router = express.Router();

const { needsVerifiedAccount } = require('../middlewares/auth.js')
const controller = require('../controllers/user.js')
const validators = require('../validators/user.js');

router.post('/aliases/:alias/renew', needsVerifiedAccount, validators.renewAlias, controller.renewAlias); // TODO: Protect with captcha

router.get('/aliases', needsVerifiedAccount, controller.getAliases);

router.post('/aliases/:alias', needsVerifiedAccount, validators.addFreeAlias, controller.addFreeAlias);

router.delete('/aliases/:alias', needsVerifiedAccount, validators.deleteAlias, controller.deleteAlias);

router.post('/aliases/:alias/records', needsVerifiedAccount, validators.addRecord , controller.addRecord);

router.patch('/aliases/:alias/records', needsVerifiedAccount, validators.editRecord , controller.editRecord);

router.delete('/aliases/:alias/records', needsVerifiedAccount, validators.deleteRecord , controller.deleteRecord);

router.post('/change-password', needsVerifiedAccount, validators.changePassword, controller.changePassword)

router.get('/2fa', needsVerifiedAccount, controller.retrieveTwoFactorAuthSecret);

router.patch('/2fa/enable', needsVerifiedAccount, controller.enableTwoFactorAuth);

router.patch('/2fa/disable', needsVerifiedAccount, controller.disableTwoFactorAuth);

router.get('/invoices', needsVerifiedAccount, controller.getInvoices);

router.get('/resend-email-confirmation', controller.resendEmailConfirmation);

router.get('/', controller.getUser);


module.exports = router;
