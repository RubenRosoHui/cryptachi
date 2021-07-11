const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

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
			payload = {
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
		else {
			payload = {
				id: user.id,
				email: user.email,
				roles: user.roles,
			}
		}

		await user.save();

		jwt.sign(
			payload,
			process.env.SECRET,
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
			id: user.id,
			email: user.email,
			roles: user.roles,
			aliases: user.aliases
		};

		jwt.sign(
			payload,
			process.env.SECRET,
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

