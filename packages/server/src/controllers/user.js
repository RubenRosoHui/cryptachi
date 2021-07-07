const User = require('../models/user.js');
const Alias = require('../models/alias.js');

exports.getAliases = async (req, res, next) => {
	const { name } = req.params;
	const user = await User.findById(req.user.id).populate("aliases");

	return res.status(200).json(user.aliases);
}