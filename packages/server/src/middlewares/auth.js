const User = require('../models/user.js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorLib = require('../lib/error.js')


exports.validateWebToken = (req, res, next) => {
	const token = req.header("token");
	if (!token) throw ErrorLib.authenticationError("Auth Error");//return res.status(401).json({ message: "Auth Error" });
	try {
		const decoded = jwt.verify(token, "randomString");
		req.user = decoded.user;
		next();
	} catch (err) {
		//console.error(e);
		//res.status(500).send({ message: "Invalid Token" });
		next(err)
	}
};