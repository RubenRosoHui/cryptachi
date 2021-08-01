const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js');
const dnsimpleLib = require('../lib/dnsimple.js');

exports.deleteAlias = async function (aliasObject) {
	const user = await User.findById(aliasObject.user).populate("aliases");

  // Delete the alias from DNSimple
  // REVIEW: Resource intensive. Is there a way to do a batch delete?
	await aliasObject.records.forEach(record => {
		dnsimpleLib.deleteRecord(record.dnsimpleID,aliasObject.domain);
	});

  // Delete the alias on our end.
	aliasObject.user = null;
	aliasObject.records = [];
	aliasObject.expiration = null;
	aliasObject.paid = false;
	user.aliases = user.aliases.filter(e => e.alias != aliasObject.alias);

  return Promise.all([aliasObject.save(), user.save()]);
}
exports.deleteRecord = async function (aliasObject, currency) {
	let record = aliasObject.records.find(record => record.currency == currency)
	let id = record.dnsimpleID;
	//send Id to dnsimple for deletion
	await dnsimpleLib.deleteRecord(id,aliasObject.domain);

	//Delete record
	aliasObject.records = aliasObject.records.filter(record => record.currency != currency);//.push({currency:currency,recipientAddress:address});
	await aliasObject.save();
}
exports.addRecord = async function (aliasObject, currency, recipientAddress, recipientName) {

	//DNSimple API code
	const id = await dnsimpleLib.addRecord(aliasObject.alias, aliasObject.domain, currency, recipientAddress, recipientName);
  console.log(id); // 20 or 30
	//Add record
	aliasObject.records.push({ dnsimpleID: id, currency, recipientAddress, recipientName });
	await aliasObject.save();
}
exports.addAlias = async function (user, alias, domain) {
	//today + 30 days
	let expiry = (Date.now() + (86400000 * 30));
	// TODO: Remove validation checks. They belong to the validation step.
	let aliasObject = await Alias.findOne({ alias: alias, domain: domain });
	if (aliasObject) {
		//alias exists, does it have a user?
		if (aliasObject.user) {
			throw errorLib.unauthorizedAccessError("Alias already exists");
		}
		else {
			aliasObject.user = user;
			aliasObject.domain = domain;
			aliasObject.expiration = expiry
			user.aliases.push(aliasObject);

			return Promise.all([aliasObject.save(), user.save()]);
		}
	}
	//alias does not exist, create it
	else {
		aliasObject = new Alias({
			alias: alias,
			user: user,
			domain: domain,
			expiration: expiry
		});
		user.aliases.push(aliasObject);
		return Promise.all([aliasObject.save(),user.save()]);
	}
}
