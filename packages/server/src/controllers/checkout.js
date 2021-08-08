const fetch = require('node-fetch');
const btcpay = require('btcpay');
const crypto = require('crypto')

//const Purchase = require('../models/purchase.js');
const Invoice = require('../models/invoice.js');
const User = require('../models/user.js');
const Alias = require('../models/alias.js');

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

	//TODO: Validators (doesEmailExist? doesUserOwnAlias? doesPlanExist? ToLowerCase)

	const userObject = await User.findOne({ email: email })
	const aliasObject = await Alias.findOne({ alias: alias, domain: domain })

	const BTCPAY_URL = process.env.BTCPAY_URL;
	const BTCPAY_KEY = process.env.BTCPAY_KEY;
	//const MERCHANT = 'Bq2YhaoF81Tz4rhMdky9yxQTy3s9j3WLeB38b3wgSSwR'
	const keypair = btcpay.crypto.load_keypair(new Buffer.from(BTCPAY_KEY, 'hex'))
	const client = new btcpay.BTCPayClient(BTCPAY_URL, keypair, { merchant: 'Cryptachi' })

	const chosenPlan = paidPlans[plan];
	//default price
	const normalPrice = (chosenPlan.price - (chosenPlan.price * (chosenPlan.percentDiscount / 100)))
	//price after special discount if any
	const price = (normalPrice - (normalPrice * (chosenPlan.specialDiscount / 100)))

	//TODO: switch price back for release
	//const btcPayInvoice = await client.create_invoice({price: price, currency: 'USD',itemCode: aliasObject._id})
	const btcPayInvoice = await client.create_invoice({ price: 0.5, currency: 'USD', redirectUrl: `${process.env.WEB_URL}/` })

	const invoice = new Invoice({
		url: btcPayInvoice.url,
		invoiceId: btcPayInvoice.id,
		user: userObject._id,
		alias: aliasObject._id,
		plan: { name: plan, duration: chosenPlan.length, price: price }
	});
	await invoice.save();

	res.status(200).json({
		message: 'Invoice created successfully',
		url: btcPayInvoice.url,
	})
}

exports.invoiceInvalid = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	console.log('invoice Invalid', req.body, req.headers)
	const invoice = await Invoice.findOne({ invoiceId: invoiceId })

	invoice.state = type;
	await invoice.save();

	res.status(200).json({ message: 'success' });
}
const invoiceExpired = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	console.log('invoice Expired', req.body, req.headers)
	const invoice = await Invoice.findOne({ invoiceId: invoiceId })

	invoice.state = type;
	await invoice.save();

	res.status(200).json({ message: 'success' });
}
const invoiceProcessing = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId })

	invoice.state = type;
	//await invoice.save();

	console.log(`invoice ${invoice.invoiceId} Processing`)

	//TODO: Move this to InvoiceSettled for release

	//retrieve alias, make it a paid based on the invoice data
	const aliasObject = await Alias.findById(invoice.alias);

	aliasObject.expiration = Date.now() + (86400000 * invoice.plan.duration);
	aliasObject.paid = true;

	await aliasObject.save();
	await invoice.save();

	// TODO: Send receipt when fully confirmed.


	//console.log('invoice processing',req.body,req.headers)
	res.status(200).json({ message: 'success' });
}
const invoiceSettled = async (req, res, next) => {
	//console.log('invoice settled',req.body,req.headers)
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId })

	invoice.state = type;
	await invoice.save();


	//TODO: create a validator that compares the btcpay-sig to the HMAC256 of the body's bytes (current code below will always fail)
	//console.log(req.headers['btcpay-sig'])
	//console.log(crypto.createHmac('sha256', '2DNzs94DU6oqcqBaJKYQVqWCbS59').update(Buffer.from(JSON.stringify(req.body))).digest('base64'))



	res.status(200).json({ message: 'success' });
}

const invoiceCreated = async (req, res, next) => {
	const { invoiceId } = req.body;
	console.log(req.body);
	res.status(200).json({ message: 'success' });
}

exports.test = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	console.log('test')
	switch (type) {
		case 'InvoiceCreated':
			console.log('InvoiceCreated');
			invoiceCreated(req, res, next);
			break;
		case 'InvoiceReceivedPayment':
			console.log('InvoiceReceivedPayment');

			res.status(200).json({ message: 'success' });
			break;
		case 'InvoiceProcessing':
			console.log('InvoiceProcessing');
			invoiceProcessing(req, res, next);
			break;
		case 'InvoiceSettled':
			console.log('InvoiceSettled');
			invoiceSettled(req, res, next);
			break;
		case 'InvoiceExpired':
			console.log('InvoiceExpired');
			invoiceExpired(req, res, next);
			break;
		default:
			console.log(type)
			console.log('no selection')
			res.status(200).json({ message: 'success' });
			break;
	}
}
