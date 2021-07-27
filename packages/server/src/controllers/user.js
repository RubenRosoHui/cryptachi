const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js')
const MongoLib = require('../lib/mongoHelper.js')

exports.getAliases = async (req, res, next) => {
  try {
		const aliases = await User.findById(req.user.id).populate("aliases").select('-_id aliases');

		res.status(200).json(aliases);
  }
  catch(err) {
    next(errorLib.errorWrapper(err));
  }
}

// TODO: Renew Alias

exports.addFreeAlias = async (req, res, next) => {
	const { alias } = req.params;
	const { domain } = req.query;

	try {
		const user = await User.findById(req.user.id).populate('aliases');

		// Prevent user from owning multiple FREE aliases
    const hasFreeAlias = user.aliases.some(alias => alias.paid === false);
		if (hasFreeAlias) throw errorLib.paymentRequiredError('Only one free alias per user.');

		await MongoLib.addAlias(user,alias,domain)

		return res.status(200).json({ message: 'Alias created successfully.' });
	}
	catch (err) {
		next(err);
	}
}

exports.deleteAlias = async (req, res, next) => {
	const { alias } = req.params;
	const { domain } = req.query;

	try {
		const aliasObject = await Alias.findOne({ alias: alias, domain: domain, user: req.user.id });

		if (!aliasObject) throw errorLib.unauthorizedAccessError("You do not own this alias.");

		await MongoLib.deleteAlias(aliasObject);

		return res.status(200).json({ message: "Alias deleted successfully" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.addRecord = async (req, res, next) => {
	const { currency, domain, recipientAddress, recipientName } = req.body;
	const { alias } = req.params;

	try {
		const aliasObject = await Alias.findOne({ alias, domain, user: req.user.id });

    if (!aliasObject) throw errorLib.unauthorizedAccessError("You do not own this alias");

		// Is domain on the free plan and already has 1 record?
		if (!aliasObject.paid && aliasObject.records.length >= 1) throw errorLib.unauthorizedAccessError("You Cannot add more records unless you upgrade this alias");
			
		await MongoLib.addRecord(aliasObject, currency, recipientAddress, recipientName);

		return res.status(200).json({ message: "Alias record created successfully" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.deleteRecord = async (req, res, next) => {
	const { currency,domain } = req.body;
	const { alias } = req.params;

	try {
		const aliasObject = await Alias.findOne({ domain, alias, user: req.user.id, "records.currency": currency });

		if (!aliasObject) throw errorLib.unauthorizedAccessError("You do not own this alias");

		await MongoLib.deleteRecord(aliasObject,currency);

		return res.status(200).json({ message: "Alias record deleted successfully" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}
