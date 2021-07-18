const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')
const dnsimpleLib = require('../lib/dnsimple.js')

exports.deleteAlias = async function (aliasObject) {
	user = await User.findById(aliasObject.user).populate("aliases")

	await aliasObject.records.forEach(record => {
		dnsimpleLib.deleteRecord(record.dnsimpleID)
	})
	aliasObject.user = null;
	aliasObject.records = [];
	aliasObject.expiration = null;
	aliasObject.paid = false;
	await aliasObject.save();
	//delete entry from aliases array
	user.aliases = user.aliases.filter(e => e.alias != aliasObject.alias);
	await user.save();
}
exports.deleteRecord = async function (aliasObject, currency) {
	let record = aliasObject.records.find(record => record.currency == currency)
	let id = record.dnsimpleID
	//send Id to dnsimple for deletion
	await dnsimpleLib.deleteRecord(id)

	//Delete record
	aliasObject.records = aliasObject.records.filter(record => record.currency != currency);//.push({currency:currency,recipientAddress:address});
	await aliasObject.save();
}
exports.addRecord = async function (aliasObject, currency, address) {

	//DNSimple API code
	let id = await dnsimpleLib.addRecord(aliasObject.alias, aliasObject.domain, currency, address)
	//Add record
	aliasObject.records.push({ dnsimpleID: id, currency: currency, recipientAddress: address });
	await aliasObject.save();
}
exports.addAlias = async function (user, alias, domain) {

	let expiry = new Date()
	expiry.setDate(expiry.getDate())
	expiry.setHours(5, 0, 0, 0)

	let aliasObject = await Alias.findOne({ alias: alias, domain: domain })
	if (aliasObject) {
		//alias exists, does it have a user?
		if (aliasObject.user) {
			throw ErrorLib.unauthorizedAccessError("Alias already exists");
		}
		else {
			aliasObject.user = user;
			aliasObject.domain = domain;
			aliasObject.expiration = expiry
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
			expiration: expiry
		})
		user.aliases.push(aliasObject);
		await aliasObject.save();
		await user.save();
	}
}