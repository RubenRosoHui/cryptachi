const mailgun = require('mailgun-js');
const DOMAIN = 'sandbox38c3d6f778a4485dafab642524f8f833.mailgun.org'//"MAIL.CRYPTACHI.COM";
const mailgunapi = '64ba82a8a713a54d2e992a2348ba3214-e31dc3cc-bde565e5'
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