const jwt = require("jsonwebtoken");
const User = require('../models/user.js');
const errorLib = require('../lib/error.js');
const fetch = require('node-fetch');

exports.needsWebToken = async (req, res, next) => {
	const authToken = req.header('Authorization');
  const signature = req.cookies.jwtSig;

	if (!authToken)
    return next(errorLib.authenticationError("Authentication token is required."));
  else if (!signature)
    return next(errorLib.authenticationError("jwtSig cookie is required."));

  const token = [authToken, signature].join('.');

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

exports.needsCaptcha = async (req, res, next) => {
	const recaptchaResponse = req.query.ct;

	if (!recaptchaResponse) return next(errorLib.authenticationError('Valid captcha token required.'));

	let verificationResult;
	const secret = process.env.RECAPTCHA_SECRET;
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaResponse}`;

	try {
		const response = await fetch(url, { method: 'POST' });
		if (!response.ok) throw 'Failed to fetch captcha verification response';
		verificationResult = await response.json();
	} catch (err) {
		return next(errorLib.errorWrapper(err));
	};

	verificationResult.success ? next() : next(errorLib.authenticationError('Requires verified captcha.'));
};
