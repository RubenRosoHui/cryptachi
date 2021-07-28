const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	roles: Array,
	resetToken: String,
	resetTokenExpiration: Date,
	isEmailConfirmed: { type: Boolean, default: false },
	isEmailConfirmedToken: String,
	aliases: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Alias'
		}
	],
	purchases: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Purchase'
		}
	]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
