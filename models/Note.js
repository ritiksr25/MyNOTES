const mongoose = require("mongoose");

const NotesSchema = mongoose.Schema({
	title: { type: String, required: true },
	text: { type: String, required: true },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: { type: Date, default: Date.now }
});

module.exports = Note = mongoose.model('Notes', NotesSchema);

