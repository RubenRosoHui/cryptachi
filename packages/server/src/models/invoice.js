const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
	url: { type: String, required: true },
	invoiceId: String,
	user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true }, //required: true },
	alias: { type: mongoose.Schema.Types.ObjectID, ref: 'Alias', required: true }, //required: true },
	state: {type: String},
	payment: {
		amount: Number,
		unit: String,
		currency: String,
	},
	plan: {
		duration: Number,
		unit: String
	}
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);