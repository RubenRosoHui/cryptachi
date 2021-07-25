const jwt = require("jsonwebtoken");
const errorLib = require('../lib/error.js');

exports.validateWebToken = (req, res, next) => {
	const token = req.header('Authorization');

	if (!token) throw errorLib.authenticationError("Authentication token is required.");

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
};
