// internal import
const Category = require('../models/CategoryModel');

// * (for user) middleware for get request
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ name: "asc" }).orFail();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for post requests
const createCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        if (!category) {
            res.status(400).send("Category input is required");
        }
        const categoryExists = await Category.findOne({ name: category });
        if (categoryExists) {
            res.status(400).send("Category already exists");
        } else {
            const categoryCreated = await Category.create({
                name: category
            });
            res.status(201).send({ categoryCreated: categoryCreated });
        }
    } catch (err) {
        next(err);
    }
};

const saveAttr = async (req, res, next) => {
    const { key, val, categoryChosen } = req.body;

    if (!key || !val || !categoryChosen) {
        return res.status(400).send("All inputs are required");
    }
    try {
        const category = categoryChosen.split("/")[0];
        const categoryExists = await Category.findOne({ name: category }).orFail();
        if (categoryExists.attrs.length > 0) {
            // if key exists in the database then add a value to the key
            var isKeyAbsentInDatabase = true;
            categoryExists.attrs.map((item, idx) => {
                if (item.key === key) {
                    isKeyAbsentInDatabase = false;
                    var copyAttributeValues = [...categoryExists.attrs[idx].value];
                    copyAttributeValues.push(val);
                    var newAttributeValues = [...new Set(copyAttributeValues)]; // Set ensures unique values
                    categoryExists.attrs[idx].value = newAttributeValues;
                }
            });

            if (isKeyAbsentInDatabase) {
                categoryExists.attrs.push({ key: key, value: [val] });
            }
        } else {
            // push to the array
            categoryExists.attrs.push({ key: key, value: [val] });
        }
        await categoryExists.save();
        let cat = await Category.find({}).sort({ name: "asc" });
        return res.status(201).json({ categoryUpdated: cat });
    } catch (err) {
        next(err);
    }
};

// * (for admin) middleware for delete request
const deleteCategory = async (req, res, next) => {
    try {
        if (req.params.category !== "Choose category") {
            const categoryExists = await Category.findOne({
                name: decodeURIComponent(req.params.category)
            }).orFail();
            await categoryExists.deleteOne();
            res.json({ categoryDeleted: true });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { getCategories, createCategory, deleteCategory, saveAttr };