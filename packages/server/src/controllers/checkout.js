const fetch = require('node-fetch');
const btcpay = require('btcpay');
const crypto = require('crypto')

const Invoice = require('../models/invoice.js');
const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js')

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
		const userObject = await User.findOne({ email: email })
		let aliasObject = await Alias.findOne({ alias: alias, domain: domain }).populate("invoice")

		if (aliasObject) {
			//does user or nobody own this alias?
			if (aliasObject.user && !aliasObject.user.equals(userObject._id)) {
			//if (!aliasObject.user || aliasObject.user.equals(userObject._id)) {
				throw errorLib.badRequestError('alias is owned by someone already')
			}
		}
		else {
			//create the alias as no one has it
			//do not assign user however
			console.log('create alias')
			aliasObject = new Alias({
				alias: alias,
				domain: domain,
			});
		}

		const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'))
		const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, { merchant: 'Cryptachi' })

		const chosenPlan = paidPlans[plan];
		//does plan exist?
		if (!chosenPlan) throw errorLib.badRequestError('Plan does not exist');

		//does alias currently have an active invoice?
		//redirect to that invoice
		if (aliasObject.invoice) //throw errorLib.conflictError('There is currently an invoice active for this alias')
		{
			return res.status(200).json({
				message: 'Invoice Already exists, redirecting',
				url: aliasObject.invoice.url,
			})
		}

		//default price
		const normalPrice = (chosenPlan.price - (chosenPlan.price * (chosenPlan.percentDiscount / 100)))
		//price after special discount if any
		const price = (normalPrice - (normalPrice * (chosenPlan.specialDiscount / 100)))

		const btcPayInvoice = await client.create_invoice({ price: price, currency: 'USD', redirectUrl: `${process.env.WEB_URL}/` })

		const invoice = new Invoice({
			url: btcPayInvoice.url,
			invoiceId: btcPayInvoice.id,
			user: userObject._id,
			alias: aliasObject._id,
			plan: { name: plan, duration: chosenPlan.length, price: price }
		});
		aliasObject.invoice = invoice._id;
		userObject.invoices.push(invoice._id);

		//TODO: we need to account for the possibility of a user upgrading a few minutes before free alias expires
		//perhaps if expiration is less than 24 hours away then set it to 24 hours?
		//this also introduces a problem of being able to keep a subscription going by creatingg invoices though
		// THIS --> //PERHAPs is there an active invoice for this domain at the moment?
		//PERHAPS a limit on how many invoices per alias a day
		//PERHAPS if invoice expires, revert expiration back to what it was

		//TODO: Figure out how to allow paid domains to be renewed
		//send reminder within last month and allow them to renew?

		Promise.all([invoice.save(), userObject.save(), aliasObject.save()])

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
	console.log('invoice Invalid', req.body, req.headers)
	const invoice = await Invoice.findOne({ invoiceId: invoiceId })

	invoice.state = type;
	await invoice.save();
}
const invoiceExpired = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	console.log('invoice Expired', req.body, req.headers)
	const invoice = await Invoice.findOne({ invoiceId: invoiceId }).populate("alias")
	const aliasObject = await Alias.findById(invoice.alias);

	aliasObject.invoice = null;

	invoice.state = type;
	await invoice.save();
	await aliasObject.save();
}
const invoiceProcessing = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId }).populate("alias")

	invoice.state = type;
	await invoice.save();

	console.log(`invoice ${invoice.invoiceId} Processing`)

	// TODO: Send receipt letting user know their order is pending

}
const invoiceSettled = async (req, res, next) => {
	const { invoiceId, type } = req.body;
	const invoice = await Invoice.findOne({ invoiceId: invoiceId })
	const aliasObject = await Alias.findById(invoice.alias);

	aliasObject.invoice = null;
	//if its a paid domain already, expiry shouldnt be based on current date but rather expiration date of their previous plan
	aliasObject.expiration = Date.now() + (86400000 * invoice.plan.duration);
	aliasObject.paid = true;

	//if alias doesnt have user, assign it
	if(!aliasObject.user){
		const userObject = await User.findById(invoice.user);
		aliasObject.user = invoice.user;
		userObject.aliases.push(aliasObject._id)

		await userObject.save();
	}

	//TODO: Let user know their order is ready

	invoice.state = type;
	await aliasObject.save();
	await invoice.save();
}

const invoiceCreated = async (req, res, next) => {
	const { invoiceId } = req.body;
	console.log(req.body);
}

exports.webhooks = async (req, res, next) => {
	const { type } = req.body;
	switch (type) {
		case 'InvoiceCreated':
			console.log('InvoiceCreated');
			invoiceCreated(req, res, next);
			break;

		//Check if payment occured afterExpiration,
		//then see if it is possible to allow the
		//transaction to go through anyways
		case 'InvoiceReceivedPayment':
			console.log(req.body);
			break;
		case 'InvoiceProcessing':
			invoiceProcessing(req, res, next);
			break;
		case 'InvoiceSettled':
			invoiceSettled(req, res, next);
			break;
		//Gets called when payment doesnt go through or payment is double spent 
		case 'InvoiceExpired':
			invoiceExpired(req, res, next);
			break;
		//invoice is invalid, undo any changes weve made to the user
		case 'InvoiceInvalid':
			invoiceInvalid(req, res, next);
			break;
		default:
			console.log(type)
			console.log('no selection')
			break;
	}
	res.status(200).json({ message: 'success' });
}
