const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const User = require('./models/user.js');

const cronLib = require('./cron/AliasExpiration.js');
const cron = require('node-cron');

// Routes
const rootRoutes = require('./routes/root.js');
const aliasRoutes = require('./routes/alias.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js')
const checkoutRoutes = require('./routes/checkout.js')

const { needsWebToken } = require('./middlewares/auth.js')

const app = express();

// MongoDB Configuration
const mongoUrl = `mongodb://${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`;

const mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};

if(process.env.MONGODB_USER) {
	mongoOptions.auth = {
		user: process.env.MONGODB_USER,
		password: process.env.MONGODB_PASS,
	};
}

// Middlewares
app.use(bodyParser.json({
	verify: function(req, res, buf) {
		if (req.url.includes('/webhooks')){
			req.rawbody = buf;
		}
	}
}));

app.use(cookieParser());

app.use('/api/aliases', aliasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', needsWebToken, userRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', rootRoutes);

// Catch-all route
app.use((_, res, _1) => {
  res.status(404).json({ message: 'Page Not Found.' });
});

// Handles invalid sandbox domains.
// This error is thrown when sending email via mailgun
// which is not included in your sandbox domain's recipient list.
app.use((error, req, res, next) => {
  if (
    error.statusCode === 400
		&& error.message === 'Sandbox subdomains are for test purposes only. Please add your own domain or add the address to authorized recipients in Account Settings.'
  ) {
    console.error(`${new Date().toISOString()} ERROR: ${error.message}`);
		const status = 500;
		const name = 'Internal Server Error';
		const message = "The server has encountered an error."
		return res.status(status).json({message: message, error:{name}});
  }

  next(error);
});

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const name = error.name || 'Internal Server Error';
	const message = error.message || "The server has encountered an error."
	res.status(status).json({message: message, error:{name}});
});

// Cron Jobs
cron.schedule('0 18 * * *', cronLib.checkExpiringAliases)
cron.schedule('* * * * *', cronLib.checkExpiredAliases)

// MAIN
// ------------------
mongoose.connect(mongoUrl, mongoOptions).then(() => {
	console.log('MongoDB connected successfully.');
	return User.findOne({ roles: 'admin' });
}).then(adminFound => {
	if (!adminFound) {
		bcrypt.hash(process.env.ADMIN_PASSWORD, 12).then(hashedPassword => {
			const user = new User({
				email: process.env.ADMIN_EMAIL.toLowerCase(),
				password: hashedPassword,
				roles: ['admin'],
				isEmailConfirmed: true,
				isEmailConfirmedToken: undefined
			});
			return user.save();
		}).then(newUser => {
			console.log(`Created initial admin user... Email: ${newUser.email}, Password: ${process.env.ADMIN_PASSWORD}`);
		});
	}

	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`Server is running on port ${port}`));
}).catch(error => console.log(error));
