const mongoose = require("mongoose");

const NotesSchema =mongoose.Schema({
	title:String,
	text: String,
	user:String,
	date: {
    	type: Date,
    	default: Date.now
    },
});

module.exports = Note = mongoose.model('Notes', NotesSchema);

