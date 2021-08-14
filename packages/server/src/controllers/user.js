const { authenticator } = require('otplib');
const bcrypt = require('bcryptjs');

const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const Invoice = require('../models/invoice.js')

const emailLib = require('../lib/email.js');
const errorLib = require('../lib/error.js');
const MongoLib = require('../lib/mongoHelper.js');

exports.getAliases = async (req, res, next) => {
	try {
		const aliases = await User.findById(req.user.id).populate("aliases").select('-_id aliases');

		res.status(200).json({
			message: 'user aliases retrieved successfully',
			aliases: aliases.aliases
		});
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.getInvoices = async (req, res, next) => {
	try {
		const userObject = await User.findById(req.user.id)

		const invoices = await Invoice.find({ _id: userObject.invoices }).populate('alias')

		const mappedInvoices = []
		invoices.map(invoice => {
			mappedInvoices.push({
				plan: invoice.plan,
				state: invoice.state,
				invoiceId: invoice.invoiceId,
				alias: `${invoice.alias.alias}.${invoice.alias.domain}`,
				date: invoice.createdAt
			})
		})

		const filteredInvoices = mappedInvoices.filter(invoice => invoice.state == 'InvoiceSettled' || invoice.state == 'InvoiceProcessing');

		res.status(200).json({
			message: 'user invoices retrieved successfully',
			invoices: filteredInvoices
		});
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.renewAlias = async (req, res, next) => {
	const { alias } = req.params;
	const { domain } = req.query;
	try {
		const aliasObject = await Alias.findOne({ alias, domain, user: req.user.id });

		if (aliasObject.paid) throw errorLib.conflictError('You cannot renew a paid alias')

		const sevenDays = 604800000; // In milliseconds
		const now = new Date();

		if (now > aliasObject.expiration)
			throw errorLib.badRequestError('Cannot renew an expired alias.');
		else if ((aliasObject.expiration - now) > sevenDays)
			throw errorLib.badRequestError('Cannot renew an alias with a remaining time of greater than 7 days.');

		const newExpiration = new Date(aliasObject.expiration.toISOString());
		newExpiration.setDate(now.getDate() + 30);

		aliasObject.expiration = newExpiration;

		await aliasObject.save();

		res.status(200).json({
			message: 'Alias renewed successfully.',
			alias: { expiration: aliasObject.expiration.toISOString() }
		});
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.addFreeAlias = async (req, res, next) => {
	const { alias } = req.params;
	const { domain } = req.query;

	try {
		const user = await User.findById(req.user.id).populate('aliases');

		// Prevent user from owning multiple FREE aliases
		const hasFreeAlias = user.aliases.some(alias => alias.paid === false);
		if (hasFreeAlias) throw errorLib.paymentRequiredError('Only one free alias per user.');

		const newAlias = await MongoLib.addAlias(user, alias, domain);

		res.status(200).json({
			message: 'Alias created successfully.',
			alias: newAlias._doc
		});
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.deleteAlias = async (req, res, next) => {
	const { alias } = req.params;
	const { domain } = req.query;

	try {
		const aliasObject = await Alias.findOne({ alias: alias, domain: domain, user: req.user.id });

		if (aliasObject.paid) throw errorLib.conflictError('You cannot delete a paid alias')

		await MongoLib.deleteAlias(aliasObject);

		return res.status(200).json({ message: "Alias deleted successfully" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.addRecord = async (req, res, next) => {
	const { currency, domain, recipientAddress, recipientName, description } = req.body;
	const { alias } = req.params;

	try {
		const aliasObject = await Alias.findOne({ alias, domain, user: req.user.id });

		// Is domain on the free plan and already has 1 record?
		if (!aliasObject.paid && aliasObject.records.length >= 1) throw errorLib.unauthorizedAccessError("You Cannot add more records unless you upgrade this alias");

		await MongoLib.addRecord(aliasObject, currency, recipientAddress, recipientName, description);

		return res.status(200).json({ message: "Alias record created successfully" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.deleteRecord = async (req, res, next) => {
	const { currency, domain } = req.body;
	const { alias } = req.params;

	try {
		const aliasObject = await Alias.findOne({ domain, alias, user: req.user.id, "records.currency": currency });

		await MongoLib.deleteRecord(aliasObject, currency);

		return res.status(200).json({ message: "Alias record deleted successfully" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.editRecord = async (req, res, next) => {
	const dnsimpleLib = require('../lib/dnsimple.js');

	const { currency, domain, recipientAddress, recipientName, description } = req.body;
	const { alias } = req.params;

	try {
		const theAlias = await Alias.findOne({ alias, domain });

		const record = theAlias.records.find(record => record.currency === currency);

		record.recipientAddress = recipientAddress;
		record.recipientName = recipientName;
		record.description = description;

		await dnsimpleLib.editRecord(record.dnsimpleID, currency, domain, recipientAddress, recipientName, description);

		await theAlias.save();

		// Return updated record.
		res.status(200).json({ message: "Record updated successfully.", record })
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

//generate secret that will be sent to front end, then displayed as a qr code
exports.retrieveTwoFactorAuthSecret = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		//if two factor is already enabled
		if (user.requireTwoFactor)
			throw errorLib.unauthorizedAccessError("Cannot generate another secret because 2FA is enabled for this account.");

		let secret;
		if (user.twoFactorSecret) {
			secret = user.twoFactorSecret;
		}
		else {
			secret = authenticator.generateSecret();
			user.twoFactorSecret = secret;

			// REVIEW: The 2FA secret should probably be hashed like the password field.
			await user.save();
		}

		const otpauthurl = authenticator.keyuri(user.email, 'Cryptachi', secret);

		res.status(200).json({ message: 'Key generated successfully', secret, otpauthurl })
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.disableTwoFactorAuth = async (req, res, next) => {
	const { authCode } = req.body
	try {
		const user = await User.findById(req.user.id);

		if (!user.requireTwoFactor) throw errorLib.unauthorizedAccessError("2FA is already disabled!")

		const verified = authenticator.check(authCode, user.twoFactorSecret);
		if (verified) {
			user.requireTwoFactor = false;
			user.twoFactorSecret = null;
			await user.save();
		}
		else {
			throw errorLib.authenticationError('You did not enter the correct Auth code')
		}

		res.status(200).json({ message: "2FA disabled successfully" })
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.changePassword = async (req, res, next) => {
	const password = req.body.password;

	try {
		const user = await User.findById(req.user.id);

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		emailLib.sendPasswordChangeNotification(user.email);

		res.status(200).json({ message: 'Password changed successfully.' });
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

//user confirms their 2fa by sending the current auth code on their phone
exports.enableTwoFactorAuth = async (req, res, next) => {

	const { authCode } = req.body
	try {
		const user = await User.findById(req.user.id);

		if (user.requireTwoFactor) throw errorLib.unauthorizedAccessError("You've already enabled 2FA")
		if (!user.twoFactorSecret) throw errorLib.unauthorizedAccessError("You cannot activate 2FA at this time")

		const verified = authenticator.check(authCode, user.twoFactorSecret);

		if (verified) {
			user.requireTwoFactor = true;
			await user.save();
		}
		else {
			throw errorLib.authenticationError('You did not enter the correct Auth code')
		}
		res.status(200).json({ message: "2FA enabled successfully" })
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}

}

exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			message: 'User info gathered successfully.',
			user: {
				isEmailConfirmed: user.isEmailConfirmed,
				requireTwoFactor: user.requireTwoFactor
			}
		});
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
}
