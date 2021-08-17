const User = require('../models/user.js');
const Alias = require('../models/alias.js');
const errorLib = require('../lib/error.js');
const mongoLib = require('../lib/mongoHelper.js');
const emailLib = require('../lib/email.js');

exports.checkExpiringAliases = async (req, res, next) => {
	const currentTime = Date.now()

	let expiringAliases = await Alias.find({
		//check all aliases expiring one week from now
		expiration: {
			$lte: currentTime + (86400000 * 7),
			$gte: currentTime + (86400000 * 6)
		}
	},
		async (err, aliases) => {
			aliases.map(async (alias) => {
				let user = await User.findById(alias.user);
				emailLib.sendAliasExpiryWarning(user.email, alias.expiration)
			})

		})

}

exports.checkExpiredAliases = async (req, res, next) => {

	let expiry = new Date();

	let expiredAliases = await Alias.find({ expiration: { $lte: expiry } });

	for (const alias of expiredAliases) {

		let user = await User.findById(alias.user);

		if (alias.invoice) {
			console.log('Alias expiration cancelled due to active invoice')
			return;
		}

		if (user) emailLib.sendAliasExpiry(user.email);
		console.log(`${alias.alias} is expired`);

		console.log(expiry)
		console.log(alias.expiration)

		await mongoLib.deleteAlias(alias);
	}
}
