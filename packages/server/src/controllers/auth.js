const User = require('../models/user.js');
const Alias = require('../models/alias.js');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {

	const { email, password, confirmPassword, alias, free, ct } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) {
			console.log("bruh");
			return res.status(400).json({
				msg: "User Already Exists"
			});
		}
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
		console.log(err.message);
		res.status(500).send("Error in Saving");
	}
}

exports.login = (req, res, next) => {

}