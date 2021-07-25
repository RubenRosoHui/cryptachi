const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')
const EmailLib = require('../lib/email.js')
const MongoLib = require('../lib/mongoHelper.js')

const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
		next(ErrorLib.errorWrapper(err)); //takes it to the next error middleware
	}
}

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({email});

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw ErrorLib.authenticationError("Invalid credentials.");

		const payload = {
			user: {
				id: user.id,
				email: user.email,
				roles: user.roles,
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
					authorization,
          payload
				});
			}
		);
	} catch (err) {
		next(ErrorLib.errorWrapper(err));
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
		next(ErrorLib.errorWrapper(err));
	}
}

exports.getResetLink = async (req, res, next) => {
	const { email } = req.query;

	try {
		const user = await User.findOne({ email: email });

		const token = crypto.randomBytes(32).toString('hex');

		user.resetToken = token;
		user.resetTokenExpiration = Date.now() + 3600000; //in one hour

		await user.save();
		await EmailLib.sendAccountVerification(email, token);

		console.log(`reset token ${token}`);

		return res.status(200).json({ message: "Email sent" });
	} catch (err) {
		next(ErrorLib.errorWrapper(err));
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
		next(ErrorLib.errorWrapper(err));
	}
}
