const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

exports.addAlias = async (req, res, next) => {

	const { name } = req.body;
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

	const { name } = req.body;
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
		}
		else throw ErrorLib.unauthorizedAccessError("You do not own this alias")
	}
	catch (err) {
		next(err);
	}
}

exports.addRecord = async (req, res, next) => {



}