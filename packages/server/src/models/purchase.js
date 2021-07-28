const mongoose = require('mongoose');

const PurchaseSchema = mongoose.Schema({
  paymentIntentId: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
	alias: { type: mongoose.Schema.Types.ObjectID, ref: 'Alias' },
  domain: { type: String, required: true },
	payment: {
    amount: Number,
    unit: String,
    currency: String,
  },
  plan: {
    duration: Number,
    unit: String
  }
}, {timestamps: true});

module.exports = mongoose.model('Purchase', PurchaseSchema);
