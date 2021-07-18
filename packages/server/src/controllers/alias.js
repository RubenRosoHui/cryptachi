const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')
const MongoLib = require('../lib/mongoHelper.js')
const dnsimpleLib = require('../lib/dnsimple.js');
const { mongo } = require('mongoose');


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

//Renew Alias 

exports.addAlias = async (req, res, next) => {

	const { alias } = req.params;
	const { domain } = req.query;
	/*
	let expiry = new Date()
	expiry.setDate(expiry.getDate())
	expiry.setHours(5, 0, 0, 0)
	*/
	try {
		//retrieve user from validateWebToken middleware
		const user = await User.findById(req.user.id);

		//Prevent user from owning multiple domains
		if (user.aliases.length >= 1) {
			throw ErrorLib.unauthorizedAccessError("Only one alias per user");
		}
		await MongoLib.addAlias(user,alias,domain)
		/*
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
				aliasObject.expiration = expiry//Date.now() + 99999999;
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
				domain: domain,
				expiration: expiry //Date.now() + 99999999
			})
			user.aliases.push(aliasObject);
			await aliasObject.save();
			await user.save();
		}*/
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
			await MongoLib.deleteAlias(aliasObject)
			return res.status(200).json({ message: "Alias deleted successfully" });
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}

exports.addRecord = async (req, res, next) => {
	const { currency, address, domain } = req.body;
	const { alias } = req.params;
	try {
		const user = await User.findById(req.user.id);//.populate("aliases");
		const aliasObject = await Alias.findOne({ alias: alias, domain: domain, user: user });

		//if user owns alias
		if (aliasObject) {

			
			//Is domain on the free plan and already has 1 record?
			if (!aliasObject.paid && aliasObject.records.length >= 1) throw ErrorLib.unauthorizedAccessError("You Cannot add more records unless you upgrade this alias")
			
			await MongoLib.addRecord(aliasObject,currency,address)

			/*
			//DNSimple API code
			let id = await dnsimpleLib.addRecord(aliasObject.alias,aliasObject.domain, currency, address)
			//console.log(id)
			//Add record
			aliasObject.records.push({ dnsimpleID:id,currency: currency, recipientAddress: address });
			await aliasObject.save();
			*/
			return res.status(200).json({ message: "Alias record created successfully" });
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}

}

exports.deleteRecord = async (req, res, next) => {

	const { currency,domain } = req.body;
	const { alias } = req.params;
	try {

		const user = await User.findById(req.user.id).populate("aliases");
		const aliasObject = await Alias.findOne({ domain:domain,alias: alias, user: user, "records.currency": currency });

		//if user owns alias
		if (aliasObject) {
			/*
			let record = aliasObject.records.find(record => record.currency == currency)//.filter(record => record.currency == currency);
			//retrieve its id
			console.log(record.dnsimpleID)
			let id = record.dnsimpleID

			//send Id to dnsimple for deletion
			await dnsimpleLib.deleteRecord(id)

			//Delete record
			aliasObject.records = aliasObject.records.filter(e => e.currency != currency);//.push({currency:currency,recipientAddress:address});
			await aliasObject.save();
			*/
			await MongoLib.deleteRecord(aliasObject,currency)
			return res.status(200).json({ message: "Alias record deleted successfully" });
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}