const mailgun = require('mailgun-js');
const DOMAIN = process.env.MAILGUNDOMAIN;
const mailgunapi = process.env.MAILGUNKEY;
const mg = mailgun({apiKey: mailgunapi,domain: DOMAIN})

exports.sendEmail = function(from,to,subject,text){
	const data = {
		from: 'Excited User <me@samples.mailgun.org>',
		to: 'mrbru3@hotmail.com',
		subject: 'Hello',
		text: 'Testing some Mailgun awesomness!'
	};
	mg.messages().send(data,function(error,body){
		console.log(body);
	})

}

exports.sendPasswordReset = function(to,token){
	const data = {
		from: 'Excited User <me@samples.mailgun.org>',
		to: to,
		subject: 'Password Reset - Cryptachi.com',
		text: `you requested a password reset Click this link to set new password
			<a href="http://localhost:3000/reset/${token}">Link</a>
		
		`
	};
	console.log(data)
	mg.messages().send(data,function(error,body){
		console.log(body);
	})
}

exports.sendAccountVerification = function(to,token){
	const data = {
		from: 'Excited User <me@samples.mailgun.org>',
		to: to,
		subject: 'Account Activation - Cryptachi.com',
		text: `you requested a password reset Click this link to set new password
			<a href="http://localhost:3000/reset/${token}">Link</a>
		
		`
	};
	console.log(data)
	mg.messages().send(data,function(error,body){
		console.log(body);
	})
}

exports.sendAliasExpiryWarning = function(to){

}

exports.sendAliasExpiry = function(to) {

}