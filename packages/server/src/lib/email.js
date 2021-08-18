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

exports.sendAliasExpiryWarning = function (to, expirationDate, alias, domain) {
	const link = `${process.env.WEB_URL}/account/aliases`
	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Alias Expiring Soon! - Cryptachi.com',
		`<p>Your alias ${alias}.${domain} will expire on ${expirationDate}</p>
		<p>You can renew now by going <a href="${link}">here</a></p>
		`
	)
}

exports.sendAliasExpiry = function (to, alias, domain) {
	const link = `${process.env.WEB_URL}/account/aliases`

	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Alias Expired - Cryptachi.com',
		`<p>Your alias ${alias}.${domain} has expired!</p>
		<p>You can always create a new one <a href="${link}">here</a></p>
		`
	)
}

exports.sendFeedback = function (to, contact) {
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

exports.sendPasswordChangeNotification = function (to) {
	//const supportLink = `${process.env.PREFIX}://${process.env.IP}:${process.env.WEBPORT}/contact`;
	const supportLink = `${process.env.WEB_URL}/contact`;

	return module.exports.sendEmail(
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

exports.sendProcessingConfirmation = function (to) {

	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Purchase Processing - Cryptachi.com',
		`
			<html>
				<p>Thank you for choosing Cryptachi! Your purchase is processing and will be ready shortly</p>
			</html>
		`
	);
}
//TODO: ADD THE INVOICE INFORMATION HERE (perhaps a table?)
exports.sendPurchaseConfirmation = function (to, invoice, alias) {

	//Date	Order ID	Status	Alias	Plan	Payment
	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Purchase Confirmation - Cryptachi.com',
		`
			<html>
				<p>Thank you, your purchase is now available</p>
				<table>
					<tr>
						<th>Date</th>
						<th>Order ID</th>
						<th>Alias</th>
						<th>Plan</th>
						<th>Payment</th>
					</tr>
					<tr>
						<th>${invoice.createdAt.toDateString()}</th>
						<th>${invoice.invoiceId}</th>
						<th>${alias.alias}.${alias.domain}</th>
						<th>${invoice.plan.name}</th>
						<th>${invoice.payments.map(x => {return `${x.paid} ${x.currency}`})}</th>
					</tr >
				</table >
			</html >
		`
	);
}