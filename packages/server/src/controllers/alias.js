const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

//GET /?names=x&names=y&names=z:
exports.queryAliases = async (req, res, next) => {
	const { names } = req.query;
	try {
		//let alias = await Alias.findOne({ name: names });

		//console.log(names);

		//convert query into an array of strings
		//const test = ["Joel.cryptachi.com", "JoeL.cryptachi.com" , "Jodpytachi.com" ];

		//const records = await Alias.find({ "name": { $in : test } });//.catch(console.error((error) => { return }));//await Alias.find().where('name').includes(test).exec();

		//return all records with domains, need to change this to check if user assigned
		// const records = await Alias.find({name:test});
		
		//returns existing domains (only ones that used to exist)
		// const records = await Alias.find({name:names,user:{"$ne": undefined}});
		
		//find all currently taken domains
		const records = await Alias.find({name:names,user:{"$ne": undefined}});
		
		
		//compare to query
		//is query an array or not?
		let availableDomains;
		if(Array.isArray(names)) {
			availableDomains = names.filter(x => !records.map(y => y.name).includes(x));
		}
		else {
			if(!records.map(y => y.name).includes(names)) availableDomains = [names];
			else availableDomains = [];
			//availableDomains = records.map(y => y.name).includes(names);
		}
		//console.log(records.filter(x => names.includes(x.name)));

		//return ones that are not taken
		return res.status(200).json(availableDomains);

		//const {name} = records;
		//const records = await Alias.find( {name: "Joel.cryptachi.com"} );//.catch(console.error((error) => { return }));//await Alias.find().where('name').includes(test).exec();
		//console.log(name);
		/*
		Alias.find( {name:{$in: [test]},function(err,docs){
			console.log(docs);
		}});
		*/
		//return a list like this: [{alias:bob, exists:false},{alias:e,exists:true}]
		//or just return a list of valid domain names (would be easier)

		//if (alias) return res.status(200).json("exists");
		//else return res.status(200).json("nope");
		//
	}
	catch (err) {
		next(err);
	}
	//console.log(names);
}

/*
exports.getAliases = async (req, res, next) => {
	const { name } = req.params;
	const user = await User.findById(req.user.id).populate("aliases");

	return res.status(200).json(user.aliases);
}*/

exports.addAlias = async (req, res, next) => {

	//const { name } = req.body;
	const { name } = req.params;

	try {
		//retrieve user from validateWebToken middleware
		const user = await User.findById(req.user.id);

		//Prevent user from owning multiple domains
		if (user.aliases.length >= 1) {
			throw ErrorLib.unauthorizedAccessError("Only one alias per user");
			//return res.status(200).json("You can only own one alias!");
		}

		//double check if domain is available
		let alias = await Alias.findOne({ name: name })
		if (alias) {
			//alias exists, does it have a user?
			if (alias.user) {
				throw ErrorLib.unauthorizedAccessError("Alias already exists");
				//return res.status(400).json("ALIAS ALREADY TAKEN");
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
		return res.status(200).json("Alias created successfully");
	}
	catch (err) {
		next(err);
	}
}

exports.deleteAlias = async (req, res, next) => {

	//const { name } = req.body;
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
			user.aliases = user.aliases.filter(e => e.name != name);
			user.save();
			return res.status(200).json("Alias deleted successfully");
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
	console.log(name);
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
			return res.status(200).json("Alias record created successfully");
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
			return res.status(200).json("Alias record deleted successfully");
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}