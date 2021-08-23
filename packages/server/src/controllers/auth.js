const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js')
const EmailLib = require('../lib/email.js')
const MongoLib = require('../lib/mongoHelper.js')

const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticator } = require('otplib');

exports.register = async (req, res, next) => {
	const { email, password, alias, domain } = req.body;

	try {
		const user = new User({
			email,
			password,
			roles: ["user"]
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		//if user is signing up with an alias
		if (alias && domain) {
			await MongoLib.addAlias(user, alias, domain);
		}

		const token = crypto.randomBytes(32).toString('hex');
		user.isEmailConfirmedToken = token;

		await user.save();

		// No need to await
		EmailLib.sendAccountVerification(email, token);

		// TODO: Remove console log when production ready.
		console.log(`activation token ${token}`);

		res.status(201).json({
			message: "User registered successfully.",
			user: {
				id: user._id,
				email: user.email,
				roles: user.roles
			}
		});
	}
	catch (err) {
		next(errorLib.errorWrapper(err)); //takes it to the next error middleware
	}
}

exports.login = async (req, res, next) => {
	const { email, password, authCode } = req.body;

	try {
		const user = await User.findOne({ email });

		const isMatch = await bcrypt.compare(password, user.password);

		const payload = {
      user: {
				id: user.id,
				email: user.email,
				roles: user.roles
      }
		};

		if (!isMatch) throw errorLib.authenticationError("Invalid credentials.");
		if (user.requireTwoFactor) {
			if (authCode) {
				const verified = authenticator.check(authCode,user.twoFactorSecret);
				if (!verified) {
					throw errorLib.authenticationError('Invalid 2FA auth code.');
				}
			}
			else {
				throw errorLib.authenticationError('OTP is required');
			}
		}

		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, authorization) => {
			if (err) throw errorLib.serverError(err.message);

			const [ header, payloadData, signature ] = authorization.split('.');

			return res.status(200)
				.cookie('jwtSig', signature, {path: '/'})
				.json({
					message: "Logged in successfully.",
					jsonWebToken: [header, payloadData].join('.')
				});
		});
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.confirmEmail = async (req, res, next) => {
	const { email, token } = req.query;

	try {
		const user = await User.findOne({ email: email, isEmailConfirmedToken: token });

		user.isEmailConfirmed = true;
		user.isEmailConfirmedToken = null;

		await user.save();

		return res.status(200).json({ message: "Account Activated" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}

exports.getResetLink = async (req, res, next) => {
	const { email } = req.query;

	try {
		const user = await User.findOne({ email: email });

		let token;
		//if a valid token currently exists
		if (user.resetToken && Date.now() < user.resetTokenExpiration) {
			token = user.resetToken;
			await EmailLib.sendPasswordReset(email, token);
		}
		else {
			token = crypto.randomBytes(32).toString('hex');
			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 3600000; //in one hour
			await Promise.all([user.save(), EmailLib.sendPasswordReset(email, token)])
		}

		console.log(`reset token ${token}`);

		return res.status(200).json({ message: "Email sent" });
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}

}

exports.postResetPassword = async (req, res, next) => {
	const { email, password, token } = req.body;

	try {
		const user = await User.findOne({ email: email, resetToken: token });

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		user.resetToken = null;
		user.resetTokenExpiration = null;

		await user.save();

		return res.status(200).json({ message: "Password Reset" });
	}
	catch (err) {
		next(errorLib.errorWrapper(err));
	}
}
