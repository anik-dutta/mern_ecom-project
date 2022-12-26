// external import
const mongoose = require('mongoose');

// creating schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "default category description" },
    image: { type: String, default: "/images/tablets-category.png" },
    attrs: [{ key: { type: String }, value: [{ type: String }] }],
});

// creating index
categorySchema.index({ description: 1 });

// creating model
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;