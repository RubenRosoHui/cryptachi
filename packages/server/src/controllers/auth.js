const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {

	const { email, password, confirmPassword, alias, free, ct } = req.body;
	try {
		let user = await User.findOne({ email });
		
		//Create user
		user = new User({
			email,
			password,
		})
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		//is user isgning up for free or paid 
		//(perhaps this should be removed?)

		//Create domain if any
		let aliasObject;
		if (alias) {

			console.log("creating new domain");
			aliasObject = new Alias({
				name: alias,
				user: user,
			})
			user.aliases.push(aliasObject);
			await aliasObject.save();
		}
		await user.save();

		const payload = {
			user: {
				id: user.id
			}
		};

		jwt.sign(
			payload,
			"randomString",
			{
				expiresIn: 10000
			},
			(err, token) => {
				if (err) throw err;
				res.status(200).json({
					token
				});
			}
		);
	}
	catch (err) {
		//res.status(500).send("Error in Saving");
		next(err); //takes it to the next error middleware
	}
}

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({
			email
		});
		if (!user) throw ErrorLib.authenticationError("Invalid Credentials");//throw new Error('Invalid Credentials');

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw ErrorLib.authenticationError("Invalid Credentials");//throw new Error('Invalid Credentials');

		const payload = {
			user: {
				id: user.id
			}
		};

		jwt.sign(
			payload,
			"randomString",
			{
				expiresIn: 3600
			},
			(err, token) => {
				if (err) throw err;
				res.status(200).json({
					token
				});
			}
		);
	} catch (err) {
		next(err);
		//onsole.error(e);
		//es.status(500).json({
		//	message: "Server Error"
		//});
	}
}

