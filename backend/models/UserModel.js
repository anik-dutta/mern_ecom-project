// external import
const mongoose = require('mongoose');

// creating schema
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    country: { type: String },
    zipCode: { type: String },
    city: { type: String },
    state: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

// creating model
const User = mongoose.model('User', userSchema);
module.exports = User;