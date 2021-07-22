const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')
const EmailLib = require('../lib/email.js')
const MongoLib = require('../lib/mongoHelper.js')

const crypto = require('crypto');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {

	const { email, password, confirmPassword, alias, domain, free, ct } = req.body;
	try {

		//Create user
		const user = new User({
			email,
			password,
			roles: ["user"]
		})
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		//if user is signing up with an alias
		if (alias && domain) {
			await MongoLib.addAlias(user, alias, domain)
		}

		const token = crypto.randomBytes(32).toString('hex')
		user.isEmailConfirmedToken = token;

		await EmailLib.sendAccountVerification(email, token);

		await user.save();
		console.log(`activation token ${token}`)
		return res.status(200).json({ message: "Email sent" });
	}
	catch (err) {
		next(err); //takes it to the next error middleware
	}
}

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({
			email
		}).populate('aliases');
		if (!user) throw ErrorLib.authenticationError("Invalid Credentials");

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw ErrorLib.authenticationError("Invalid Credentials");

		const payload = {
			user: {
				id: user.id,
				email: user.email,
				roles: user.roles,
				//aliases: user.aliases
			}
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: '7d'
			},
			(err, authorization) => {
				if (err) throw ErrorLib.serverError(err.message);
				res.status(200).json({
					authorization, payload //include payload in repsonse
				});
			}
		);
	} catch (err) {
		next(err);
	}
}

exports.verifyUser = async (req, res, next) => {
	const { token } = req.params;
	const { email } = req.query;
	try {
		const user = await User.findOne({ email: email, isEmailConfirmedToken: token });
		if (user) {
			if (user.isEmailConfirmed) throw ErrorLib.conflictError('account already activated')

			user.isEmailConfirmed = true;

			await user.save();

			return res.status(200).json({ message: "Account Activated" });
		}
		else throw ErrorLib.unprocessableEntityError('Email does not exist');

	}
	catch (err) {
		next(err);
	}
}

exports.resetPasswordGet = async (req, res, next) => {
	const { email } = req.query

	try {
		//is there an account with this email?
		const user = await User.findOne({ email: email })
		if (user) {

			const token = crypto.randomBytes(32).toString('hex')

			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 3600000; //in one hour
			await EmailLib.sendAccountVerification(email, token);
			await user.save();
			console.log(`reset token ${token}`)
			return res.status(200).json({ message: "Email sent" });
		}
		else throw ErrorLib.unprocessableEntityError('Email does not exist');
	} catch (err) {
		next(err);
	}

}
exports.resetPasswordPost = async (req, res, next) => {
	const { email } = req.query
	const { password, confirmPassword } = req.body;
	//const { resetToken } = req.query
	const { token } = req.params;
	try {
		const user = await User.findOne({ email: email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
		if (user) {

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			return res.status(200).json({ message: "Password Reset" });
		}
		else throw ErrorLib.authenticationError('Invalid Email and/or token');

	}
	catch (err) {
		next(err);
	}
}
