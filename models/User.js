const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");

const UserSchema =mongoose.Schema({
	name:String,
	username:String,
	password: String
});

module.exports = users = mongoose.model('users', UserSchema);
