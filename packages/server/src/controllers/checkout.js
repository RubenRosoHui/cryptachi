const Purchase = require('../models/purchase.js');
const fetch = require('node-fetch');

const paidPlans = {
  oneYear: {
    price: 600,
    currency: 'usd',
    percentDiscount: 0,
  },
  twoYear: {
    price: 1200,
    currency: 'usd',
    percentDiscount: 5
  },
  threeYear: {
    price: 1800,
    currency: 'usd',
    percentDiscount: 10
  },
  fourYear: {
    price: 2400,
    currency: 'usd',
    percentDiscount: 15
  },
  fiveYear: {
    price: 3000,
    currency: 'usd',
    percentDiscount: 20
  }
}

async function calculatePrice(plan, paymentCurrency) {
  const { price, currency, percentDiscount } = paidPlans[plan];
  const discountedPrice = Math.round(price - price*(percentDiscount/100)) / 100;

  const baseUrl = `https://pro-api.coinmarketcap.com/v1/tools/price-conversion`;
  const query = `?amount=${discountedPrice}&symbol=${currency}&convert=${paymentCurrency}`;

  // TODO: Find a way to cache this request.
  const response = await fetch(baseUrl + query, {
    method: 'GET',
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY }
  });

  const jsonResponse = await response.json();

  return jsonResponse.data.quote[paymentCurrency.toUpperCase()].price;
}

exports.postPaymentIntent = async (req, res, next) => {
  const { alias, domain, plan, payment } = req.body;

  // TODO: Double check the price
	const calculatedPrice = await calculatePrice(plan, payment.currency);
  console.log('Price from client: ', payment.price);
  console.log('Calculated price: ', calculatedPrice);

  // TODO: Request a payment intent from the gateway
	const paymentIntent = {
    id: 12345,
    status: 'awaiting-transaction',
    address: 'btcaddress'
  };

  res.status(200).json({
    message: 'Payment Intent successfully created.',
    paymentIntent
  });
}

// NOTE: This route is only accessible to the payment gateway.
exports.postPurchase = (req, res, next) => {
	// TODO: Create the purchase.

  // TODO: Send updates via websocket.

  // TODO: Send receipt when fully confirmed.
}
