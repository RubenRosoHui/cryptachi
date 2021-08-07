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
  // const link = `${process.env.PREFIX}://${process.env.IP}:${process.env.WEBPORT}/reset-password?token=${token}&email=${to}`;
  const link = `${process.env.WEB_URL}/reset-password?token=${token}&email=${to}`;

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
  //const link = `${process.env.PREFIX}://${process.env.IP}:${process.env.WEBPORT}/confirm-email?email=${to}&token=${token}`;
  const link = `${process.env.WEB_URL}/confirm-email?email=${to}&token=${token}`;

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

exports.sendAliasExpiryWarning = function (to,expirationDate) {
	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Alias Expiring Soon! - Cryptachi.com',
		`Your alias is gonna expire on ${expirationDate}
		`
	)
}

exports.sendAliasExpiry = function (to) {
	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Alias Expired - Cryptachi.com',
		`Your alias has expired!
		`
	)
}

exports.sendFeedback = function(to, contact) {
  return module.exports.sendEmail(
    'mail@cryptachi.com',
    to,
    'Feedback - Cryptachi.com',
    `
			<h1>Customer Feedback</h1>
			<h2>Contact Details</h2>
			<ul>
				<li>Name: ${contact.name}</li>
				<li>Email: ${contact.email}</li>
				<li>Phone: ${contact.phone || 'N/A'}</li>
			</ul>
			<h2>Message</h2>
			<p>${contact.message}</p>
		`
  );
}

exports.sendPasswordChangeNotification = function(to) {
  //const supportLink = `${process.env.PREFIX}://${process.env.IP}:${process.env.WEBPORT}/contact`;
  const supportLink = `${process.env.WEB_URL}/contact`;

  module.exports.sendEmail(
    'mail@cryptachi.com',
    to,
    'Account Password Changed - Cryptachi.com',
    `
			<html>
				<p>You are being notified that your account password was changed.</p>
				<p>If you did not ask for a password change, please <a href="${supportLink}">contact support</a> right away.</p>
			</html>
		`
  );
}
