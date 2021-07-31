const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const cronLib = require('./cron/AliasExpiration.js');
const cron = require('node-cron');

// Routes
const aliasRoutes = require('./routes/alias.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js')
const checkoutRoutes = require('./routes/checkout.js')

const { needsWebToken, needsVerifiedAccount } = require('./middlewares/auth.js')

const app = express();

// MongoDB Configuration
const mongoUrl = `mongodb://${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`;

var mongoOptions;
if(process.env.MONGODB_USER){
	mongoOptions = {
		auth: {
			user: process.env.MONGODB_USER,
			password: process.env.MONGODB_PASS,
		},
		useNewUrlParser: true,
		useUnifiedTopology: true
	};
}
else {
	mongoOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	};
}

// Middlewares
app.use(bodyParser.json());

app.use('/api/aliases', aliasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', needsWebToken, needsVerifiedAccount, userRoutes);
app.use('/api/checkout', checkoutRoutes);

// Catch-all route
app.use((_, res, _1) => {
  res.status(404).json({ message: 'Page Not Found.' });
});

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const name = error.name || 'Internal Server Error';
	const message = error.message || "The server has encountered an error."
	res.status(status).json({message: message, error:{name}});
});

cron.schedule('0 18 * * *', cronLib.checkExpiringAliases)
cron.schedule('* * * * *', cronLib.checkExpiredAliases)

mongoose.connect(mongoUrl, mongoOptions).then(() => {
	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`server is running on port ${port}`));
}).catch(error => console.log(error));
