const mongoose = require('mongoose');

const AliasSchema = mongoose.Schema({
	name: {type: String, unique: true},
	paid: { type: Boolean, default: false},
	user: {type: mongoose.Schema.Types.ObjectID, ref: 'User'},
	expiration: Date,
	records: [
		{
			currency: {type: String, required: true},
			recipientName: String,
			recipientAddress: {type: String, required:true},
			description: String
		}
	],
},{timestamps:true});

module.exports = mongoose.model('Alias',AliasSchema);