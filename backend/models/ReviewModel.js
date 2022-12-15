// external import
const mongoose = require('mongoose');

// creating schema
const reviewSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true }
    },
}, { timestamps: true });

// creating model
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;