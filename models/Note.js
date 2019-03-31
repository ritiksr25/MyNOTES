const mongoose = require("mongoose");

const NotesSchema =mongoose.Schema({
	title: {iv:String, encryptedData: String},
	text: {iv:String, encryptedData: String},
	user: String,
	date: {
    	type: Date,
    	default: Date.now()
    },
});

module.exports = Note = mongoose.model('Notes', NotesSchema);

