const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')
const MongoLib = require('../lib/mongoHelper.js')


//GET /?names=a,b,c&domain=cryptachi.com
exports.queryAliases = async (req, res, next) => {
	const { names, domain } = req.query;
	try {
		//find all currently taken domains
		let aliases = names.split(',');

		
		const records = await Alias.find({ alias: aliases, domain: domain, user: { "$ne": null } }).select('alias -_id');
		const invoiceRecords = await Alias.find({ alias: aliases, domain: domain, invoice: { "$ne": null } }).select('alias -_id');

		const takenAliases = records.map(r => r.alias);
		const invoiceAliases = invoiceRecords.map(r => r.alias);

		const availableAliases = aliases.filter(alias => !takenAliases.includes(alias) && !invoiceAliases.includes(alias));

		return res.status(200).json(availableAliases);
	}
	catch (err) {
		next(err);
	}
}
