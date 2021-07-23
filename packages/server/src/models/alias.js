const mongoose = require('mongoose');

const AliasSchema = mongoose.Schema({
	alias: { type: String },
	domain: { type: String },
	paid: { type: Boolean, default: false },
	user: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
	expiration: Date,
	records: [
		{
			_id: false,
			dnsimpleID: String,
			currency: { type: String, required: true },
			recipientName: String,
			recipientAddress: { type: String, required: true },
			description: String
		}
	],
}, { timestamps: true });

AliasSchema.index({ alias: 1, domain: 1 }, { unique: true })

module.exports = mongoose.model('Alias', AliasSchema);