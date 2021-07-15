const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')
const EmailLib = require('../lib/email.js')

const crypto = require('crypto');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const alias = require('../models/alias.js');

exports.register = async (req, res, next) => {

	const { email, password, confirmPassword, alias, domain, free, ct } = req.body;
	try {
		// let user = await User.findOne({ email });

		//Create user
		let user = new User({
			email,
			password,
			roles: ["user"]
		})
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		//if user is signing up with an alias
		let payload;
		let aliasObject;
		if (alias && domain) {
			aliasObject = await Alias.findOne({ alias: alias, domain: domain })
			if (aliasObject) {
				//alias exists, does it have a user?
				if (aliasObject.user) {
					throw ErrorLib.unauthorizedAccessError("Alias already exists");
				}
				else {
					aliasObject.user = user;
					aliasObject.domain = domain;
					user.aliases.push(aliasObject);
					await aliasObject.save();
					//await user.save();
				}
			}
			//alias does not exist, create it
			else {
				aliasObject = new Alias({
					alias: alias,
					user: user,
					domain: domain
				})
				user.aliases.push(aliasObject);
				await aliasObject.save();
				//await user.save();
			}
			/*
			payload = {
				user: {
					id: user.id,
					email: user.email,
					roles: user.roles,
					aliases: [{
						paid: aliasObject.paid,
						id: aliasObject.id,
						alias: aliasObject.alias,
						domain: aliasObject.domain,
						records: aliasObject.records,
						createdAt: aliasObject.createdAt,
						updatedAt: aliasObject.updatedAt,
						__v: aliasObject.__v
					}]
				}
			}
			*/
		}
		else {
			/*
			payload = {
				user: {
					id: user.id,
					email: user.email,
					roles: user.roles,
				}
			}
			*/
		}


		crypto.randomBytes(32, async (err, buffer) => {
			if (err) throw ErrorLib.serverError();

			const token = buffer.toString('hex');

			user.isEmailConfirmedToken = token;

			await user.save();
			await EmailLib.sendAccountVerification(email,token);
			return res.status(200).json({ message: "Email sent" });
		}
		)




		
		//return res.status(200).json({ message: "Email sent" });
		/*
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: '7d'
			},
			(err, authorization) => {
				if (err) throw err;
				res.status(200).json({
					authorization, payload //include payload in repsonse
				});
			}
		);
		*/
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
		if (!user) throw ErrorLib.authenticationError("Invalid Credentials");//throw new Error('Invalid Credentials');

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw ErrorLib.authenticationError("Invalid Credentials");//throw new Error('Invalid Credentials');

		const payload = {
			user: {
				id: user.id,
				email: user.email,
				roles: user.roles,
				aliases: user.aliases
			}
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: '7d'
			},
			(err, authorization) => {
				if (err) throw err;
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

}

exports.resetPasswordGet = async (req, res, next) => {
	const { email } = req.query

	try {
		//is there an account with this email?
		let user = await User.findOne({ email: email })
		if (user) {

			crypto.randomBytes(32, async (err, buffer) => {
				if (err) throw ErrorLib.serverError();

				const token = buffer.toString('hex');

				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000; //in one hour
				await user.save();

				EmailLib.sendPasswordReset(email, token)
				return res.status(200).json({ message: "Email sent" });
			}
			)
		}
		else throw ErrorLib.authenticationError('Email does not exist');
	} catch (err) {
		next(err);
	}

}
exports.resetPasswordPost = async (req, res, next) => {
	//const {email} = req.query
	const { password, confirmPassword } = req.body;
	//const { resetToken } = req.query
	const { token } = req.params;
	try {
		let user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
		if (user) {

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			return res.status(200).json({ message: "Password Reset" });
		}
		else throw ErrorLib.authenticationError('Email does not exist');

	}
	catch (err) {
		next(err);
	}
}