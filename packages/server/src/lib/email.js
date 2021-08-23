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
exports.sendPurchaseConfirmation = function (to, invoice, alias) {
	return module.exports.sendEmail(
		'mail@cryptachi.com',
		to,
		'Purchase Confirmation - Cryptachi.com',
		`
		<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <!--  This file has been downloaded from bootdey.com @bootdey on twitter -->
    <!--  All snippets are MIT license http://bootdey.com/license -->
    <title>simple invoice receipt email template - Bootdey.com</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <link href="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
	<script src="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
<table class="body-wrap">
    <tbody><tr>
        <td></td>
        <td class="container" width="600">
            <div class="content">
                <table class="main" width="100%" cellpadding="0" cellspacing="0">
                    <tbody><tr>
                        <td class="content-wrap aligncenter">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tbody><tr>
                                    <td class="content-block">
                                        <h2>Thank you for your purchase</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        <table class="invoice">
                                            <tbody><tr>
                                                <td>${to}<br>Invoice #${invoice.invoiceId}<br>${invoice.createdAt.toDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table class="invoice-items" cellpadding="0" cellspacing="0">
                                                        <tbody><tr>
                                                            <td>${alias.alias}.${alias.domain} ${invoice.plan.name}</td>
                                                            <td class="alignright">${invoice.payments.map(x => {return `${x.paid} ${x.currency}`})}</td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        Cryptachi.com
                                    </td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>
                </tbody></table>
                <div class="footer">
                    <table width="100%">
                        <tbody><tr>
                        </tr>
                    </tbody></table>
                </div></div>
        </td>
        <td></td>
    </tr>
</tbody></table>

<style type="text/css">
/* -------------------------------------
    GLOBAL
    A very basic CSS reset
------------------------------------- */
* {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
    box-sizing: border-box;
    font-size: 14px;
}

img {
    max-width: 100%;
}

body {
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
    width: 100% !important;
    height: 100%;
    line-height: 1.6;
}

/* Let's make sure all tables have defaults */
table td {
    vertical-align: top;
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */
body {
    background-color: #f6f6f6;
}

.body-wrap {
    background-color: #f6f6f6;
    width: 100%;
}

.container {
    display: block !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    /* makes it centered */
    clear: both !important;
}

.content {
    max-width: 600px;
    margin: 0 auto;
    display: block;
    padding: 20px;
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
}

.content-wrap {
    padding: 20px;
}

.content-block {
    padding: 0 0 20px;
}

.header {
    width: 100%;
    margin-bottom: 20px;
}

.footer {
    width: 100%;
    clear: both;
    color: #999;
    padding: 20px;
}
.footer a {
    color: #999;
}
.footer p, .footer a, .footer unsubscribe, .footer td {
    font-size: 12px;
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1, h2, h3 {
    font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    color: #000;
    margin: 40px 0 0;
    line-height: 1.2;
    font-weight: 400;
}

h1 {
    font-size: 32px;
    font-weight: 500;
}

h2 {
    font-size: 24px;
}

h3 {
    font-size: 18px;
}

h4 {
    font-size: 14px;
    font-weight: 600;
}

p, ul, ol {
    margin-bottom: 10px;
    font-weight: normal;
}
p li, ul li, ol li {
    margin-left: 5px;
    list-style-position: inside;
}

/* -------------------------------------
    LINKS & BUTTONS
------------------------------------- */
a {
    color: #1ab394;
    text-decoration: underline;
}

.btn-primary {
    text-decoration: none;
    color: #FFF;
    background-color: #1ab394;
    border: solid #1ab394;
    border-width: 5px 10px;
    line-height: 2;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    border-radius: 5px;
    text-transform: capitalize;
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
    margin-bottom: 0;
}

.first {
    margin-top: 0;
}

.aligncenter {
    text-align: center;
}

.alignright {
    text-align: right;
}

.alignleft {
    text-align: left;
}

.clear {
    clear: both;
}

/* -------------------------------------
    ALERTS
    Change the class depending on warning email, good email or bad email
------------------------------------- */
.alert {
    font-size: 16px;
    color: #fff;
    font-weight: 500;
    padding: 20px;
    text-align: center;
    border-radius: 3px 3px 0 0;
}
.alert a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
}
.alert.alert-warning {
    background: #f8ac59;
}
.alert.alert-bad {
    background: #ed5565;
}
.alert.alert-good {
    background: #1ab394;
}

/* -------------------------------------
    INVOICE
    Styles for the billing table
------------------------------------- */
.invoice {
    margin: 40px auto;
    text-align: left;
    width: 80%;
}
.invoice td {
    padding: 5px 0;
}
.invoice .invoice-items {
    width: 100%;
}
.invoice .invoice-items td {
    border-top: #eee 1px solid;
}
.invoice .invoice-items .total td {
    border-top: 2px solid #333;
    border-bottom: 2px solid #333;
    font-weight: 700;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 640px) {
    h1, h2, h3, h4 {
        font-weight: 600 !important;
        margin: 20px 0 5px !important;
    }

    h1 {
        font-size: 22px !important;
    }

    h2 {
        font-size: 18px !important;
    }

    h3 {
        font-size: 16px !important;
    }

    .container {
        width: 100% !important;
    }

    .content, .content-wrap {
        padding: 10px !important;
    }

    .invoice {
        width: 100% !important;
    }
}

</style>

<script type="text/javascript">

</script>
</body>
</html>

`
	);
}


/*
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
						<th>Date:</th><td>${invoice.createdAt.toDateString()}</td>
					</tr>
					<tr>
						<th>Order ID:</th><td>${invoice.invoiceId}</td>
					</tr>
					<tr>
						<th>Alias:</th><td>${alias.alias}.${alias.domain}</td>
					</tr>
					<tr>
						<th>Plan:</th><td>${invoice.plan.name}</td>
					</tr>
					<tr>
						<th>Payment:</th><td>${invoice.payments.map(x => {return `${x.paid} ${x.currency}`})}</td>
					</tr>
				</table>
			</html >
		`
	);
}
*/