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

exports.getInvoice = async (req, res, next) => {
	const { invoiceId } = req.query;

	try {
		const invoice = await Invoice.findOne({ invoiceId: invoiceId })

		return res.status(200).json({
			message: 'invoice status retrieved successfully',
			invoice: {
				state: invoice.state,

			}
		})
	}
	catch (err) {
		next(err);
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

		if (!aliasObject) {
			aliasObject = new Alias({
				alias: alias,
				domain: domain,
			});
		}

		const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));
		const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, { merchant: 'Cryptachi' });

		const chosenPlan = paidPlans[plan];

		//does alias currently have an active invoice?
		if (aliasObject.invoice) {
			let redirect = true;

			if (aliasObject.invoice.plan.name != plan) {
				redirect = false;
				if (aliasObject.invoice.state != 'InvoiceCreated') {
					redirect = true;
				}
			}

			if (redirect) {
				return res.status(200).json({
					message: 'Invoice Already exists, redirecting',
					url: aliasObject.invoice.url,
				})
			}
		}

		//default price
		const normalPrice = (chosenPlan.price - (chosenPlan.price * (chosenPlan.percentDiscount / 100)));
		//price after special discount if any
		const price = (normalPrice - (normalPrice * (chosenPlan.specialDiscount / 100)));

		const btcPayInvoice = await client.create_invoice({
			price: price,
			currency: 'USD',
			redirectUrl: `${process.env.WEB_URL}/checkout-message?alias=${alias}&domain=${domain}&invoiceId={InvoiceId}`,
			//expirationTime: Date.now() + 90000,
			buyerEmail: email,
			itemCode: plan,
			itemDesc: `$${price} USD ${chosenPlan.length / 365} year plan for ${alias}.${domain}`
		});

		const invoice = new Invoice({
			url: btcPayInvoice.url,
			invoiceId: btcPayInvoice.id,
			user: userObject._id,
			alias: aliasObject._id,
			plan: { name: plan, duration: chosenPlan.length, price: price }
		});
		aliasObject.invoice = invoice._id;
		userObject.invoices.push(invoice._id);

		await aliasObject.save();
		await Promise.all([invoice.save(), userObject.save()]);

		res.status(200).json({
			message: 'Invoice created successfully',
			url: btcPayInvoice.url,
		})
	}
	catch (err) {
		next(err);
	}
}

const invoiceInvalid = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId });

	const aliasObject = await Alias.findById(invoice.alias);

	//aliasObject.invoice = null;
	if (aliasObject.invoice && aliasObject.invoice.equals(invoice._id)) {
		aliasObject.invoice = null;
		await aliasObject.save();
		console.log(invoiceId, invoice._id, 'VALID')
	}
	else {
		console.log(invoiceId, invoice._id, 'INVALID')
	}

	invoice.state = type;
	await invoice.save();
}

const invoiceExpired = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId }).populate("alias");

	const aliasObject = await Alias.findById(invoice.alias);

	//if invoice does not match properly, occurs when user decides to change the plan they wanted
	if (aliasObject.invoice && aliasObject.invoice.equals(invoice._id)) {
		aliasObject.invoice = null;
		await aliasObject.save();
		console.log(invoiceId, invoice._id, 'VALID')
	}
	else {
		console.log(invoiceId, invoice._id, 'INVALID')
	}
	const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));
	const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, { merchant: 'Cryptachi' });
	const btcPayInvoice = await client.get_invoice(invoiceId)

	let partiallyPaid = false;
	invoice.payments = [];
	btcPayInvoice.cryptoInfo.forEach(coin => {
		if (Number(coin.cryptoPaid) > 0) {
			partiallyPaid = true;

			invoice.payments.push({
				currency: coin.cryptoCode,
				paid: coin.cryptoPaid
			})
		}
	})
	invoice.partiallyPaid = partiallyPaid;

	invoice.state = type;
	await invoice.save();
}

const invoiceProcessing = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId }).populate("user");

	const aliasObject = await Alias.findById(invoice.alias);

	const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));
	const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, { merchant: 'Cryptachi' });
	const btcPayInvoice = await client.get_invoice(invoiceId)

	//update the active invoice on the alias if the current one is incorrect
	if (!aliasObject.invoice.equals(invoice._id)) {
		aliasObject.invoice = invoice._id
		console.log('running')
		await aliasObject.save();
	}

	invoice.payments = [];
	btcPayInvoice.cryptoInfo.forEach(coin => {
		if (Number(coin.cryptoPaid) > 0) {
			invoice.payments.push({
				currency: coin.cryptoCode,
				paid: coin.cryptoPaid
			})
		}
	})

	invoice.state = type;
	await invoice.save();

	emailLib.sendProcessingConfirmation(invoice.user.email)
}

const invoiceSettled = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId });

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

	emailLib.sendPurchaseConfirmation(userObject.email, invoice, aliasObject);

	const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));
	const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, { merchant: 'Cryptachi' });
	const btcPayInvoice = await client.get_invoice(invoiceId)

	invoice.payments = [];
	btcPayInvoice.cryptoInfo.forEach(coin => {
		if (Number(coin.cryptoPaid) > 0) {
			invoice.payments.push({
				currency: coin.cryptoCode,
				paid: coin.cryptoPaid
			})
		}
	})

	invoice.state = type;

	Promise.all([aliasObject.save(), invoice.save(), userObject.save()]);

}

exports.webhooks = async (req, res, next) => {
	const { invoiceId, type } = req.body;

	try {
		//return success so that BTCpay knows the server is still running
		const invoice = await Invoice.findOne({ invoiceId: invoiceId });
		if (!invoice) return res.status(200).json({ message: `Invalid state ${invoiceId} sent to webhook` }) && console.log(`Invalid state ${invoiceId} sent to webhook`);

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
		return res.status(200).json({ message: 'success' });
	}
	catch (err) {
		next(err);
	}
}
