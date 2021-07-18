const mailgun = require('mailgun-js');
const DOMAIN = process.env.MAILGUNDOMAIN;
const mailgunapi = process.env.MAILGUNKEY;
const mg = mailgun({apiKey: mailgunapi,domain: DOMAIN})

exports.sendEmail = function(from,to,subject,text){
	const data = {
		from: from,
		to: to,
		subject: subject,
		text: text
	};
	mg.messages().send(data,function(error,body){
		console.log(body);
	})
}

exports.sendPasswordReset = async function(to,token){
	await module.exports.sendEmail(
		'Excited User <me@samples.mailgun.org>',
		to,
		'Password Reset - Cryptachi.com',
		`
		you requested a password reset Click this link to set new password
			<a href=" http://localhost:3000/reset-password?token=${token}&email=${to} ">Link</a>
		
		`);
}

exports.sendAccountVerification = async function(to,token){
	await module.exports.sendEmail(
		'Excited User <me@samples.mailgun.org>',
		to,
		'Account Activation - Cryptachi.com',
		`Please click the llink below to confirm your new cryptachi account
			<a href=" http://localhost:3000/reset/${token} ">Link</a>
		`
	)
}

exports.sendAliasExpiryWarning = function(to){

}

exports.sendAliasExpiry = async function(to) {
	await module.exports.sendEmail(
		'Excited User <me@samples.mailgun.org>',
		to,
		'Alias Expired - Cryptachi.com',
		`Your alias has expired!
		`
	)
}