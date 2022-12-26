// external import
const mongoose = require('mongoose');

// internal import
const Review = require('./ReviewModel');

// creating image schema
const imageSchema = new mongoose.Schema({
    path: { type: String, required: true }
});

// creating product schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Add name of the product'], unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    count: { type: Number, required: true },
    price: { type: Number, required: true },
    rating: { type: Number },
    reviewsNumber: { type: Number },
    sales: { type: Number, default: 0 },
    attrs: [
        { key: { type: String }, value: { type: String } }
        // [{ key: "color", value: "red" }, { key: "size", value: "1 TB" }]
    ],
    images: [imageSchema],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Review
    }]
}, {
    timestamps: true,
});

// creating index 
productSchema.index({ name: 'text', description: 'text' }, { name: 'TextIndex' });
productSchema.index({ 'attrs.key': 1, 'attrs.value': 1 });

// creating model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;