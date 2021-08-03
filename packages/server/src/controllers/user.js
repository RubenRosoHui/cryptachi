const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js');
const MongoLib = require('../lib/mongoHelper.js');

exports.getAliases = async (req, res, next) => {
  try {
		const aliases = await User.findById(req.user.id).populate("aliases").select('-_id aliases');

		res.status(200).json(aliases);
  }
  catch(err) {
    next(errorLib.errorWrapper(err));
  }
}

exports.renewAlias = async (req, res, next) => {
  const alias = req.params.alias;
  const domain = req.body.domain;

  try {
    const aliasObject = await Alias.findOne({ alias, domain, user: req.user.id });

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
  catch(err) {
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
	const { currency,domain } = req.body;
	const { alias } = req.params;

	try {
		const aliasObject = await Alias.findOne({ domain, alias, user: req.user.id, "records.currency": currency });

		await MongoLib.deleteRecord(aliasObject,currency);

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

		await dnsimpleLib.editRecord(record.dnsimpleID, currency, domain, recipientAddress, recipientName);

    await theAlias.save();

    // Return updated record.
		res.status(200).json({ message: "Record updated successfully.", record })
  } catch(err) {
    next(errorLib.errorWrapper(err));
  }
}
