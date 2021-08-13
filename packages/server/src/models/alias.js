const mongoose = require('mongoose');

const AliasSchema = mongoose.Schema({
	alias: { type: String },
	domain: { type: String },
	paid: { type: Boolean, default: false },
	user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', default: null },
	expiration: { type: Date, default: null },
	//reference to the currently active invoice
	invoice: { type: mongoose.Schema.Types.ObjectID, ref: 'Invoice', default: null },
	records: [
		{
			_id: false,
			dnsimpleID: String,
			currency: { type: String, required: true },
			recipientName: { type: String, required: true },
			recipientAddress: { type: String, required: true },
			description: String
		}
	],
}, { timestamps: true });

AliasSchema.index({ alias: 1, domain: 1 }, { unique: true })

module.exports = mongoose.model('Alias', AliasSchema);
