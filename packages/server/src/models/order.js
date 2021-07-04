const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
	alias: {type: mongoose.Schema.Types.ObjectID, ref: 'Alias'},
	price: number,

	user: {type: mongoose.Schema.Types.ObjectID, ref: 'User'},
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order',OrderSchema);