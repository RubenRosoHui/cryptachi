const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
	url: { type: String, required: true },
	invoiceId: String,
	user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true }, //required: true },
	alias: { type: mongoose.Schema.Types.ObjectID, ref: 'Alias', required: true }, //required: true },
	state: { type: String, default: "InvoiceCreated" },
	plan: {
		duration: Number,
		name: String,
		price: Number//TODO: amount currency unit
	},
	payments: [{
		currency: String, //cryptoInfo[].cryptoCode
		paid: String, //cryptoInfo[].cryptoPaid
	}],
	partiallyPaid: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);