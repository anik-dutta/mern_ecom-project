// external imports
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// internal imports
const Product = require('../models/ProductModel');
const recordsPerPage = require('../config/pagination');
const imageValidate = require('../utils/imageValidate');

// * (for user) middleware for get requests
const getProducts = async (req, res, next) => {
    try {
        //* pagination
        const pageNum = Number(req.query.pageNum) || 1;

        // * sort by name, price etc.
        let sort = {};
        const sortOption = req.query.sort || '';
        if (sortOption) {
            let sortOpt = sortOption.split('_');
            sort = { [sortOpt[0]]: Number(sortOpt[1]) };
        }

        // * filter by price, rating, category, attribute
        let query = {};
        let hasQueryCondition = false;

        let priceQueryCondition = {};
        if (req.query.price) {
            hasQueryCondition = true;
            priceQueryCondition = { price: { $lte: Number(req.query.price) } };
        }

        let ratingQueryCondition = {};
        if (req.query.rating) {
            hasQueryCondition = true;
            ratingQueryCondition = { rating: { $gte: Number(req.query.rating) } };
        }

        let categoryQueryCondition = {};
        const categoryName = req.params.categoryName || '';
        if (categoryName) {
            hasQueryCondition = true;
            let a = categoryName.replace(/,/g, '/');
            var regEx = new RegExp('^' + a);
            categoryQueryCondition = { category: regEx };
        }
        if (req.query.category) {
            hasQueryCondition = true;
            let a = req.query.category.split(',').map((item) => {
                if (item) {
                    return new RegExp('^' + item);
                }
            });
            categoryQueryCondition = {
                category: { $in: a },
            };
        }
        let attrsQueryCondition = [];
        if (req.query.attrs) {
            attrsQueryCondition = req.query.attrs.split(',').reduce((acc, item) => {
                if (item) {
                    let a = item.split('-');
                    let values = [...a];
                    // remove first item
                    values.shift();
                    let a1 = {
                        attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
                    };
                    acc.push(a1);

                    return acc;
                } else {
                    return acc;
                }
            }, []);

            hasQueryCondition = true;
        }

        let searchQuery = req.params.searchQuery || '';
        searchQuery = searchQuery.trim();
        let select = {};
        let searchQueryCondition = {};
        if (searchQuery) {
            hasQueryCondition = true;
            searchQueryCondition = { $text: { $search: searchQuery } };
            select = { score: { $meta: 'textScore' } };
            sort = { score: { $meta: 'textScore' } };
        }

        if (hasQueryCondition) {
            query = {
                $and: [
                    priceQueryCondition,
                    ratingQueryCondition,
                    categoryQueryCondition,
                    searchQueryCondition,
                    ...attrsQueryCondition
                ],
            };
        }

        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .select(select)
            .skip(recordsPerPage * (pageNum - 1))
            .sort(sort)
            .limit(recordsPerPage);

        res.json({
            products, pageNum,
            paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('reviews').orFail();
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const getBestsellers = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1 } },
            { $group: { _id: '$category', doc_with_max_sales: { $first: '$$ROOT' } } },
            { $replaceWith: '$doc_with_max_sales' },
            { $match: { sales: { $gt: 0 } } },
            { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
            { $limit: 3 }
        ]);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for get request
const adminGetProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ category: 1 }).select('name price category');
        return res.json(products);
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for post requests
const adminCreateProduct = async (req, res, next) => {
    try {
        const { name, description, count, category, price, attributesTable } = req.body;
        const product = new Product({
            name, description, count, price, category
        });
        if (attributesTable.length > 0) {
            attributesTable.map((item) => {
                product.attrs.push(item);
            });
        }

        await product.save();
        res.json({ message: 'product created', productId: product._id });
    } catch (error) {
        next(error);
    }
};

const adminUpload = async (req, res, next) => {
    if (req.query.cloudinary === 'true') {
        try {
            let product = await Product.findById(req.query.productId).orFail();
            product.images.push({ path: req.body.url });
            await product.save();
        } catch (error) {
            next(error);
        }
        return;
    }
    try {
        if (!req.files || !!req.files.images === false) {
            return res.status(400).send('No files were uploaded.');
        }

        const validateResult = imageValidate(req.files.images);
        if (validateResult.error) {
            return res.status(400).send(validateResult.error);
        }

        let imagesTable = [];
        if (Array.isArray(req.files.images)) {
            imagesTable = req.files.images;
        } else {
            imagesTable.push(req.files.images);
        }

        const uploadDirectory = path.resolve(__dirname, '../../frontend/public/images/products');
        let product = await Product.findById(req.query.productId).orFail();

        for (let image of imagesTable) {
            let fileName = uuidv4() + path.extname(image.name);
            let uploadPath = uploadDirectory + '/' + fileName;
            product.images.push({ path: '/images/products/' + fileName });
            image.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        }
        await product.save();
        return res.send('File uploaded!');
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for put request
const adminUpdateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).orFail();
        const { name, description, count, category, price, attributesTable } = req.body;
        product.name = name || product.name;
        product.description = description || product.description;
        product.count = count || product.count;
        product.category = category || product.category;
        product.price = price || product.price;

        product.attrs = [];
        if (attributesTable.length > 0) {
            attributesTable.map((item) => {
                product.attrs.push(item);
            });
        }

        await product.save();
        res.json({ message: 'Product updated' });
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for delete requests
const adminDeleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id).orFail();

        res.json({ message: 'product removed' });
    } catch (error) {
        next(error);
    }
};

const adminDeleteProductImage = async (req, res, next) => {
    const imagePath = decodeURIComponent(req.params.imagePath);
    if (req.query.cloudinary = 'true') {
        try {
            await Product.findByIdAndUpdate({ _id: req.params.productId }, { $pull: { images: { path: imagePath } } }).orFail();
            return res.end();
        } catch (error) {
            next(error);
        }
        return;
    }
    try {
        const finalPath = path.resolve('../frontend/public') + imagePath;

        fs.unlink(finalPath, (err) => {
            if (err) {
                res.status(500).send(err);
            }
        });
        await Product.findOneAndUpdate(
            { _id: req.params.productId },
            { $pull: { images: { path: imagePath } } }
        ).orFail();
        return res.end();
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getProductById, getBestsellers, adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct, adminUpload, adminDeleteProductImage };