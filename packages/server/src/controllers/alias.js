const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

//GET /?names=x&names=y&names=z:
exports.queryAliases = async (req, res, next) => {
	const { names } = req.query;
	try {
		//find all currently taken domains
		const records = await Alias.find({name:names,user:{"$ne": undefined}});
		
		//compare to query
		let availableDomains;
		if(Array.isArray(names)) {
			availableDomains = names.filter(x => !records.map(y => y.name).includes(x));
		}
		else {
			if(!records.map(y => y.name).includes(names)) availableDomains = [names];
			else availableDomains = [];
		}
		//return ones that are not taken
		return res.status(200).json(availableDomains);
	}
	catch (err) {
		next(err);
	}
}

exports.addAlias = async (req, res, next) => {

	const { name } = req.params;

	try {
		//retrieve user from validateWebToken middleware
		const user = await User.findById(req.user.id);

		//Prevent user from owning multiple domains
		if (user.aliases.length >= 1) {
			throw ErrorLib.unauthorizedAccessError("Only one alias per user");
		}

		//double check if domain is available
		let alias = await Alias.findOne({ name: name })
		if (alias) {
			//alias exists, does it have a user?
			if (alias.user) {
				throw ErrorLib.unauthorizedAccessError("Alias already exists");
			}
			else {
				alias.user = user;
				user.aliases.push(alias);
				await alias.save();
				await user.save();
			}
		}
		//alias does not exist, create it
		else {
			alias = new Alias({
				name: name,
				user: user
			})
			user.aliases.push(alias);
			await alias.save();
			await user.save();
		}
		return res.status(200).json({message:"Alias created successfully"});
	}
	catch (err) {
		next(err);
	}
}

exports.deleteAlias = async (req, res, next) => {

	const { name } = req.params;
	try {
		const user = await User.findById(req.user.id).populate("aliases");
		const alias = await Alias.findOne({ name: name, user: user });

		//if user owns alias
		if (alias) {
			//remove references from user and alias
			alias.user = undefined;
			alias.save();
			//delete entry from aliases array
			user.aliases = user.aliases.filter(e => e.name != alias.name);
			user.save();
			return res.status(200).json({message:"Alias deleted successfully"});
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}

exports.addRecord = async (req, res, next) => {
	const { currency, address } = req.body;
	const { name } = req.params;
	try {
		const user = await User.findById(req.user.id);//.populate("aliases");
		const alias = await Alias.findOne({ name: name, user: user });

		//if user owns alias
		if (alias) {

			//Is domain on the free plan and already has 1 record?

			//Is Currency valid?
			//does a record for this currency already exist?

			//DNSimple API code

			//Add record
			alias.records.push({ currency: currency, recipientAddress: address });
			alias.save();
			return res.status(200).json({message:"Alias record created successfully"});
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}

}

exports.deleteRecord = async (req, res, next) => {

	const { currency } = req.body;
	const { name } = req.params;
	try {

		const user = await User.findById(req.user.id).populate("aliases");
		const alias = await Alias.findOne({ name: name, user: user });

		//if user owns alias
		if (alias) {

			//Is Currency Valid?
			//Does a record with this currency exist?

			//DNSimple API code

			//Delete record
			alias.records = alias.records.filter(e => e.currency != currency);//.push({currency:currency,recipientAddress:address});
			alias.save();
			return res.status(200).json({message:"Alias record deleted successfully"});
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}