const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

//GET /?names=a,b,c&domain=cryptachi.com
exports.queryAliases = async (req, res, next) => {
	const { names, domain } = req.query;
	try {
		//find all currently taken domains
		let aliases = names.split(',');

		const records = await Alias.find({ alias: aliases, domain: domain, user: { "$ne": null } }).select('alias -_id');

		const takenAliases = records.map(r => r.alias);

		const availableAliases = aliases.filter(alias => !takenAliases.includes(alias));

		return res.status(200).json(availableAliases);
	}
	catch (err) {
		next(err);
	}
}

exports.addAlias = async (req, res, next) => {

	const { alias } = req.params;
	const { domain } = req.query;

	try {
		//retrieve user from validateWebToken middleware
		const user = await User.findById(req.user.id);

		//Prevent user from owning multiple domains
		if (user.aliases.length >= 1) {
			throw ErrorLib.unauthorizedAccessError("Only one alias per user");
		}

		//double check if domain is available
		let aliasObject = await Alias.findOne({ alias: alias, domain: domain })
		if (aliasObject) {
			//alias exists, does it have a user?
			if (aliasObject.user) {
				throw ErrorLib.unauthorizedAccessError("Alias already exists");
			}
			else {
				aliasObject.user = user;
				aliasObject.domain = domain;
				user.aliases.push(aliasObject);
				await aliasObject.save();
				await user.save();
			}
		}
		//alias does not exist, create it
		else {
			aliasObject = new Alias({
				alias: alias,
				user: user,
				domain: domain
			})
			user.aliases.push(aliasObject);
			await aliasObject.save();
			await user.save();
		}
		return res.status(200).json({ message: "Alias created successfully" });
	}
	catch (err) {
		next(err);
	}
}

exports.deleteAlias = async (req, res, next) => {

	const { alias } = req.params;
	const { domain } = req.query;
	try {
		const user = await User.findById(req.user.id).populate("aliases");
		const aliasObject = await Alias.findOne({ alias: alias, domain: domain, user: user });

		//if user owns alias
		if (aliasObject) {
			//remove references from user and alias
			aliasObject.user = null;
			aliasObject.records = [];
			await aliasObject.save();
			//delete entry from aliases array
			user.aliases = user.aliases.filter(e => e.alias != aliasObject.alias);
			await user.save();
			return res.status(200).json({ message: "Alias deleted successfully" });
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}

exports.addRecord = async (req, res, next) => {
	const { currency, address } = req.body;
	const { alias } = req.params;
	try {
		const user = await User.findById(req.user.id);//.populate("aliases");
		const aliasObject = await Alias.findOne({ alias: alias, user: user });

		//if user owns alias
		if (aliasObject) {

			//Is domain on the free plan and already has 1 record?
			if(!aliasObject.paid && aliasObject.records.length >= 1) throw ErrorLib.unauthorizedAccessError("You Cannot add more records unless you upgrade this alias")

			//DNSimple API code

			//Add record
			aliasObject.records.push({ currency: currency, recipientAddress: address });
			await aliasObject.save();
			return res.status(200).json({ message: "Alias record created successfully" });
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}

}

exports.deleteRecord = async (req, res, next) => {

	const { currency } = req.body;
	const { alias } = req.params;
	try {

		const user = await User.findById(req.user.id).populate("aliases");
		const aliasObject = await Alias.findOne({ alias: alias, user: user, "records.currency": currency });

		//if user owns alias
		if (aliasObject) {

			//Is Currency Valid?
			//Does a record with this currency exist?

			//DNSimple API code

			//Delete record
			aliasObject.records = aliasObject.records.filter(e => e.currency != currency);//.push({currency:currency,recipientAddress:address});
			await aliasObject.save();
			return res.status(200).json({ message: "Alias record deleted successfully" });
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}