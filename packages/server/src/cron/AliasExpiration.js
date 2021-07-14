const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const ErrorLib = require('../lib/error.js')

exports.CheckExpiredAliases = async (req,res,next) => {
	//console.log('test');

	//greater than today, less than 3-5 days from now
	let e = await Alias.find({expiration: { $gte: '2021-07-13', $lte: '2021-08-13'  }}, async (err,aliases) => {
		//console.log(alias)
		//let today = new Date()
		//console.log(alias.expiration)
		//console.log(alias[1])
		aliases.map( async (alias) => {
			//console.log(alias.expiration)
			let today = new Date()
			let isToday = (today.toDateString() == alias.expiration.toDateString());
			//console.log(isToday)

			//is it expired?
			if(isToday){
				//remove user from alias 

				//WE ALSO NEED TO REMOVE THE ALIAS REFERENCE FROM THE USER DONT FORGET

				//console.log(alias)
				alias.expiration = null;
				alias.user = null;
				alias.records = [];
				alias.paid = false;
				await alias.save()
				console.log(alias)


				//send email saying it expired?
			}
			else{
				//Send an email warning them that their alias is expiring
			}
		})
		//await aliases[0].save()
		//console.log(aliases[0])
		//let isToday = (today.toDateString() == alias.expiration.toDateString());
		//console.log(isToday)
	
	});


	//console.log(e[0]);
	//console.log(e[1]);
	
	//Go through each Alias and return ones that expire in 3 days

	//is it expiring soon?
	//Send an email warning them that their alias is expiring

	//is it expired?
	//remove user from alias

}