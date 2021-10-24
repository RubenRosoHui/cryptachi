/*
Name: alias.js
Purpose: Controller to handle alias routes

*/
//Custom Libraries 
const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const Invoice = require('../models/invoice.js');
const ErrorLib = require('../lib/error.js')
const MongoLib = require('../lib/mongoHelper.js')

//Checks for and Returns possible alias
exports.queryAliases = async (req, res, next) => {
	const { names, domain, email } = req.query;
	try {
		//find all currently taken domains
		let aliases = names.split(',');
		const records = await Alias.find({ alias: aliases, domain: domain, user: { "$ne": null } }).select('alias -_id');
		let invoiceRecords = await Alias.find({ alias: aliases, domain: domain, invoice: { "$ne": null } }).select('alias -_id');
		const takenAliases = records.map(r => r.alias);
		let invoiceAliases = invoiceRecords.map(r => r.alias);

		if (email) {
			const user = await User.findOne({ email: email })

			//get all users active invoices
			const usersActiveInvoices = await Invoice.find({ state: 'InvoiceCreated', user: user }).populate('alias').select('alias -_id')
			const usersActiveAliases = usersActiveInvoices.map(r => r.alias.alias);

			//filter through invoiceRecords, any with our alias' are excluded
			invoiceAliases = invoiceAliases.filter(alias => !usersActiveAliases.includes(alias))
		}
		const availableAliases = aliases.filter(alias => !takenAliases.includes(alias) && !invoiceAliases.includes(alias));
		return res.status(200).json(availableAliases);
	}
	catch (err) {
		next(err);
	}
}
