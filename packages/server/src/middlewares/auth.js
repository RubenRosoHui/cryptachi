const jwt = require("jsonwebtoken");
const User = require('../models/user.js');
const errorLib = require('../lib/error.js');

exports.needsWebToken = async (req, res, next) => {
	const token = req.header('Authorization');

	if (!token) throw errorLib.authenticationError("Authentication token is required.");

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;

    // NOTE: This helps prevent many errors and redundancies where controllers/middlewares
		// after this one assume that the decoded user exists. That is not always the case.
    const user = await User.findById(req.user.id);
		if (!user) throw errorLib.notFoundError('Authentication Failed: User not found.');

    // Append additional info to the req.user object.
		req.user.isEmailConfirmed = user.isEmailConfirmed;

		next();
	} catch (err) {
		next(errorLib.errorWrapper(err));
	}
};

// NOTE: This needs the req.user object from the needsWebToken middleware.
//       Always have the needsWebToken before this middleware.
exports.needsVerifiedAccount = async (req, res, next) => {
	// This is mostly to ensure that needsWebToken was properly added
	// before this middleware and that it succeeded in validation.
  if (!req.user) return next(errorLib.authenticationError('Checking account confirmation failed: Authentication is required.'));

  req.user.isEmailConfirmed ? next() : next(errorLib.unauthorizedAccessError('Access granted only to confirmed accounts.'));
}
