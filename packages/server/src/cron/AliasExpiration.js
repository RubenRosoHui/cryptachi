const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')
const MongoLib = require('../lib/mongoHelper.js')
const emailLib = require('../lib/email.js')
const dnsimpleLib = require('../lib/dnsimple.js')

exports.CheckExpiredAliases = async (req, res, next) => {
	//console.log('test');

	//greater than today, less than 3-5 days from now
	//let e = await Alias.find({expiration: { $gte: '2021-07-13', $lte: '2021-08-13'  }}, async (err,aliases) => {

	let expiry = new Date()
	expiry.setDate(expiry.getDate())
	expiry.setHours(6, 0, 0, 0)

	//find all expired, send email and delete
	let expiredAliases = await Alias.find({ expiration: { $lte: expiry/*Date.now()*/ } }, async (err, aliases) => {

		aliases.map(async (alias) => {
			let user = await User.findById(alias.user)
			await emailLib.sendAliasExpiry(user.email)
			console.log(`${alias.alias} is expired`)
			console.log(alias.expiration)
			console.log(expiry)
			console.log(expiry >= alias.expiration)
			console.log(expiry <= alias.expiration)

			//alias.records.forEach(record => {
			//	dnsimpleLib.deleteRecord(record.dnsimpleID)
			//})
			await MongoLib.deleteAlias(alias)
			
			console.log('deleted')
		})

	});
	//find all soon to be expired paid domains,

	//find all soon to be expired free domains

	//find all soon to be expired
	/*
	let e = await Alias.find({ expiration: { $lte: Date.now() + 86400000 } }, async (err, aliases) => {
		//console.log(alias)
		//let today = new Date()
		//console.log(alias.expiration)
		//console.log(alias[1])
		aliases.map(async (alias) => {
			//console.log(alias.expiration)
			let today = new Date()

			//perhaps this should be either today or an already past date
			//let isToday = (today.toDateString() == alias.expiration.toDateString());
			let isToday = (today.toDateString() == alias.expiration.toDateString());
			//console.log(today.toDateString())
			//console.log(alias.expiration.toDateString())

			//console.log(isToday)
			//Date.
			//is it expired?
			if (isToday) {
				//remove user from alias 

				//await MongoLib.deleteAlias(alias)
				console.log('deleted')

				//send email saying it expired?
			}
			else {
				//Send an email warning them that their alias is expiring
			}
		})
		//await aliases[0].save()
		//console.log(aliases[0])
		//let isToday = (today.toDateString() == alias.expiration.toDateString());
		//console.log(isToday)

	});*/

	//console.log(e)
	//console.log(e[0]);
	//console.log(e[1]);

	//Go through each Alias and return ones that expire in 3 days

	//is it expiring soon?
	//Send an email warning them that their alias is expiring

	//is it expired?
	//remove user from alias

}