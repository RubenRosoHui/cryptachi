const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: {type:String, unique:true, required:true},
	password: {type:String, required:true},
	roles: Array,
    createdAt: { type: Date, default: Date.now },
    resetToken: String,
    resetExpiration: Date,
    aliases: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alias"
        }
    ]
});

module.exports = mongoose.model('User',UserSchema);