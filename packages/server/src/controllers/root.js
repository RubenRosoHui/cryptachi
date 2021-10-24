/*
Name: root.js
Purpose: Controller to handle root routes

*/
//Custom Libraries
const Users = require('../models/user.js');
const emailLib = require('../lib/email.js');
const errorLib = require('../lib/error.js');

//Contact Cryptachi
exports.contact = async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  try {
    const adminUsers = await Users.find({ roles: 'admin' });

    const adminEmails = adminUsers.map(admin => admin.email);

    await emailLib.sendFeedback(adminEmails, { name, email, phone, message });

		res.status(200).json({ message: "Message sent successfully." });
  } catch(err) {
    next(errorLib.errorWrapper(err));
  }
}
