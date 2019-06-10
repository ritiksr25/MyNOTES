const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    googleID: { type: String, required: true },
    img: { type: String },
    createdAt: { type: Date, default: Date.now }
})

module.exports = User = mongoose.model('User', UserSchema);