const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

exports.deleteAlias = async function(aliasObject){
	user = await User.findById(aliasObject.user).populate("aliases")

	aliasObject.user = null;
	aliasObject.records = [];
	aliasObject.expiration = null;
	aliasObject.paid = false;
	await aliasObject.save();
	//delete entry from aliases array

	console.log(user)
	console.log(user.id)
	user.aliases = user.aliases.filter(e => e.alias != aliasObject.alias);
	console.log(user.aliases.filter(e => e.alias != aliasObject.alias))
	await user.save();
}
/*
exports.addAlias = async function(user,aliasName,domainName){
	let alias = await Alias.findOne({ name: aliasName })
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
			name: aliasName,
			user: user
		})
		user.aliases.push(alias);		
		console.log("alias");
		await alias.save();
		await user.save();

	}
	return alias;
}
*/