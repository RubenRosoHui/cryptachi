const mongoose = require('mongoose');

const SubdomainSchema = mongoose.Schema({
	//_id: abcd,
	name: {type: String, unique: true},
	paid: { type: Boolean, default: false},
	//user: Mongoose.schema.ref,
	expiration: Date,
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date,
	records: [
		{
			currency: {type: String, required: true},
			recipientName: String,
			recipientAddress: {type: String, required:true},
			description: String
		}
	],

});

module.exports = mongoose.model('Subdomain',SubdomainSchema);