const fetch = require('node-fetch');
const btcpay = require('btcpay');
const crypto = require('crypto');

const Invoice = require('../models/invoice.js');
const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js');
const emailLib = require('../lib/email.js');

const paidPlans = {
	oneYear: {
		price: 6,
		currency: 'usd',
		percentDiscount: 0, //default discount
		specialDiscount: 0, //special discount, applied after default discount
		length: 365
	},
	twoYear: {
		price: 12,
		currency: 'usd',
		percentDiscount: 5,
		specialDiscount: 0,
		length: 730
	},
	threeYear: {
		price: 18,
		currency: 'usd',
		percentDiscount: 10,
		specialDiscount: 0,
		length: 1095
	},
	fourYear: {
		price: 24,
		currency: 'usd',
		percentDiscount: 15,
		specialDiscount: 0,
		length: 1460
	},
	fiveYear: {
		price: 30,
		currency: 'usd',
		percentDiscount: 20,
		specialDiscount: 0,
		length: 1825
	}
}

exports.createInvoice = async (req, res, next) => {
	// https://www.npmjs.com/package/btcpay
	// On the server set up an access token and run the below script
	// /node -e "const btcpay=require('btcpay'); new btcpay.BTCPayClient('https://testnet.demo.btcpayserver.org', btcpay.crypto.load_keypair(Buffer.from('PRIVATE KEY', 'hex'))).pair_client('CLIENT KEY').then(console.log).catch(console.error)"
	const { alias, domain, email, plan } = req.body;

	try {
		const userObject = await User.findOne({ email: email });
		let aliasObject = await Alias.findOne({ alias: alias, domain: domain }).populate("invoice");

		if(!aliasObject){
			aliasObject = new Alias({
				alias: alias,
				domain: domain,
			});
		}

		const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));
		const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, { merchant: 'Cryptachi' });

		const chosenPlan = paidPlans[plan];

		//does alias currently have an active invoice?
		//redirect to that invoice
		if (aliasObject.invoice) {
			return res.status(200).json({
				message: 'Invoice Already exists, redirecting',
				url: aliasObject.invoice.url,
			})
		}

		//default price
		const normalPrice = (chosenPlan.price - (chosenPlan.price * (chosenPlan.percentDiscount / 100)));
		//price after special discount if any
		const price = (normalPrice - (normalPrice * (chosenPlan.specialDiscount / 100)));

		const btcPayInvoice = await client.create_invoice({ price: price, currency: 'USD', redirectUrl: `${process.env.WEB_URL}/` });

		const invoice = new Invoice({
			url: btcPayInvoice.url,
			invoiceId: btcPayInvoice.id,
			user: userObject._id,
			alias: aliasObject._id,
			plan: { name: plan, duration: chosenPlan.length, price: price }
		});
		aliasObject.invoice = invoice._id;
		userObject.invoices.push(invoice._id);

		Promise.all([invoice.save(), userObject.save(), aliasObject.save()]);

		res.status(200).json({
			message: 'Invoice created successfully',
			url: btcPayInvoice.url,
		})
	}
	catch (err) {
		next(err);
	}
}

const validateInvoice = (invoice, invalidStates = []) => {
	if (!invoice) {
		console.log('This invoice was created improperly')
		throw errorLib.badRequestError('This invoice was created improperly')
	}
	if (invalidStates.includes(invoice.state)) {
		console.log('The invoice has already received this information')
		throw errorLib.badRequestError('The invoice has already received this information')
	}
}

const invoiceInvalid = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId });

	validateInvoice(invoice, ['InvoiceInvalid'])

	const aliasObject = await Alias.findById(invoice.alias);

	aliasObject.invoice = null;

	invoice.state = type;
	await invoice.save(); 
	await aliasObject.save();
}

const invoiceExpired = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId }).populate("alias");

	validateInvoice(invoice, ['InvoiceSettled', 'InvoiceInvalid'])

	const aliasObject = await Alias.findById(invoice.alias);

	aliasObject.invoice = null;

	invoice.state = type;
	await invoice.save();
	await aliasObject.save();
}

const invoiceProcessing = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId }).populate("user");

	validateInvoice(invoice, ['InvoiceSettled', 'InvoiceInvalid', 'InvoiceExpired'])

	invoice.state = type;
	await invoice.save();

	emailLib.sendProcessingConfirmation(invoice.user.email)
}

const invoiceSettled = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId });

	//if invoice already settled, abort
	validateInvoice(invoice, ['InvoiceSettled'])

	const aliasObject = await Alias.findById(invoice.alias);
	const userObject = await User.findById(invoice.user);

	aliasObject.invoice = null;

	if (aliasObject.paid) {
		aliasObject.expiration = aliasObject.expiration.valueOf() + (86400000 * invoice.plan.duration);
	}
	else {
		aliasObject.expiration = Date.now() + (86400000 * invoice.plan.duration);
		aliasObject.paid = true;
	}
	//if alias doesnt have user, assign it
	if (!aliasObject.user) {
		aliasObject.user = invoice.user;
		userObject.aliases.push(aliasObject._id);
	}

	emailLib.sendPurchaseConfirmation(userObject.email);

	invoice.state = type;

	Promise.all([aliasObject.save(), invoice.save(), userObject.save()]);
}

exports.webhooks = async (req, res, next) => {
	const { type } = req.body;

	try {
		console.log(type, req.body);
		switch (type) {
			case 'InvoiceCreated':
				break;
			case 'InvoiceReceivedPayment':
				break;
			case 'InvoiceProcessing':
				await invoiceProcessing(req, res, next);
				break;
			case 'InvoiceSettled':
				await invoiceSettled(req, res, next);
				break;
			//Gets called when payment doesnt go through or payment is double spent 
			case 'InvoiceExpired':
				await invoiceExpired(req, res, next);
				break;
			//invoice is invalid, seems to only be called if BTCpay server admin intervenes
			case 'InvoiceInvalid':
				await invoiceInvalid(req, res, next);
				break;
			default:
				console.log(type)
				console.log('no selection')
				break;
		}
		res.status(200).json({ message: 'success' });
	}
	catch (err) {
		next(err);
	}
}
