const mailgun = require('mailgun-js');
const DOMAIN = process.env.MAILGUNDOMAIN;
const mailgunapi = process.env.MAILGUNKEY;
const mg = mailgun({ apiKey: mailgunapi, domain: DOMAIN })

exports.sendEmail = function (from, to, subject, text) {
	const data = {
		from: from,
		to: to,
		subject: subject,
		html: text
	};

	return mg.messages().send(data).then(value => console.log(value));
}

exports.sendPasswordReset = function (to, token) {
  const link = `${process.env.PREFIX}://${process.env.IP}:${process.env.WEBPORT}/reset-password?token=${token}&email=${to}`;

	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Password Reset - Cryptachi.com',
		`
			<p>
				You requested a password reset. To set a new password, click <a href="${link}">here</a>.
			</p>
			<p>
				Or copy and paste the following link into your browser:
				<span style="text-decoration: underline;">${link}</span>
			</p>
		`
  );
}

exports.sendAccountVerification = function (to, token) {
  const link = `${process.env.PREFIX}://${process.env.IP}:${process.env.WEBPORT}/reset/${token}`;

	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Account Activation - Cryptachi.com',
		`
			<p>
				To confirm your new Cryptachi account, click <a href="${link}">here</a>.
			</p>
			<p>
				Or copy and paste the following link into your browser:
				<span style="text-decoration: underline;">${link}</span>
			</p>
		`
	);
}

exports.sendAliasExpiryWarning = function (to) {}

exports.sendAliasExpiry = function (to) {
	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Alias Expired - Cryptachi.com',
		`Your alias has expired!
		`
	)
}