const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js');
const dnsimpleLib = require('../lib/dnsimple.js');

exports.deleteAlias = async function (aliasObject) {
	const user = await User.findById(aliasObject.user).populate("aliases");

	// Delete the alias from DNSimple
	await aliasObject.records.forEach(record => {
		dnsimpleLib.deleteRecord(record.dnsimpleID, aliasObject.domain);
	});

	// Delete the alias on our end.
	aliasObject.user = null;
	aliasObject.records = [];
	aliasObject.expiration = null;
	aliasObject.paid = false;

	if (user) {
		user.aliases = user.aliases.filter(e => e.alias != aliasObject.alias);
		return Promise.all([aliasObject.save(), user.save()]);
	}
	else {
		return Promise.all([aliasObject.save()]);
	}
}
exports.deleteRecord = async function (aliasObject, currency) {
	let record = aliasObject.records.find(record => record.currency == currency)
	let id = record.dnsimpleID;
	//send Id to dnsimple for deletion
	await dnsimpleLib.deleteRecord(id, aliasObject.domain);

	//Delete record
	aliasObject.records = aliasObject.records.filter(record => record.currency != currency);//.push({currency:currency,recipientAddress:address});
	await aliasObject.save();
}

exports.addRecord = async function (aliasObject, currency, recipientAddress, recipientName, description) {

	//DNSimple API code
	const id = await dnsimpleLib.addRecord(aliasObject.alias, aliasObject.domain, currency, recipientAddress, recipientName, description);
	console.log(id); // 20 or 30
	//Add record
	aliasObject.records.push({ dnsimpleID: id, currency, recipientAddress, recipientName, description });
	await aliasObject.save();
}
exports.addAlias = async function (user, alias, domain) {
	const expiry = Date.now() + (86400000 * 30); // today + 30 days

	const aliasFound = await Alias.findOne({ alias: alias, domain: domain });

	let newAlias;
	if (aliasFound) {
		newAlias = aliasFound;
		newAlias.user = user._id;
		newAlias.expiration = expiry;
	} else {
		newAlias = new Alias({
			alias: alias,
			user: user._id,
			domain: domain,
			expiration: expiry
		});
	}

	user.aliases.push(newAlias._id);

	await Promise.all([newAlias.save(), user.save()]);

	return newAlias;
}
