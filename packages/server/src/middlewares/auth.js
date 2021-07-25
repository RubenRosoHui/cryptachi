const jwt = require("jsonwebtoken");
const User = require('../models/user.js');
const errorLib = require('../lib/error.js');

exports.needsWebToken = (req, res, next) => {
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

// NOTE: This needs the req.user object from the needsWebToken middleware.
//       Always have the needsWebToken before this middleware.
exports.needsVerifiedAccount = (req, res, next) => {
  const user = User.findById(req.user.id);

  // This is mostly to ensure that needsWebToken was properly added
	// before this middleware or succeeded.
  if (!user) return next(errorLib.authenticationError('Authentication is required.'));

  user.isEmailConfirmed ? next() : next(errorLib.unauthorizedError('Access cannot be given until account is confirmed.'));
}
