// external import
const { ObjectId } = require('mongodb');

// internal imports
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

// * (for user) middleware for get requests
const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: ObjectId(req.user._id) });
        res.send(orders);
    } catch (error) {
        next(error);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', '-password -isAdmin -_id -__v -createdAt -updatedAt').orFail();
        res.send(order);
    } catch (error) {
        next(error);
    }
};

// * (for user) middleware for post request
const createOrder = async (req, res, next) => {
    try {
        const { cartItems, orderTotal, paymentMethod } = req.body;
        if (!cartItems || !orderTotal || !paymentMethod) {
            return res.status(400).send('All inputs are required');
        }

        let ids = cartItems.map((item) => {
            return item.productID;
        });
        let qty = cartItems.map((item) => {
            return Number(item.quantity);
        });

        await Product.find({ _id: { $in: ids } }).then((products) => {
            products.forEach((product, idx) => {
                product.sales += qty[idx];
                product.save();
            });
        });

        const createdOrder = await Order.create({
            user: ObjectId(req.user._id),
            orderTotal, cartItems, paymentMethod
        });

        res.status(201).send(createdOrder);
    } catch (error) {
        next(error);
    }
};

// * (for user) middleware for put request
const updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).orFail();
        order.isPaid = true;
        order.paidAt = Date.now();

        const updatedOrder = await order.save();
        res.send(updatedOrder);
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for get requests
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', '-password -__v').sort({ paymentMethod: 'desc' });
        res.send(orders);
    } catch (error) {
        next(error);
    }
};

const getOrderForAnalysis = async (req, res, next) => {
    try {
        const start = new Date(req.params.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.params.date);
        end.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end }
        }).sort({ createdAt: 'asc' });

        res.send(orders);
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for put request
const updateOrderToDelivered = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).orFail();
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.send(updatedOrder);
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserOrders, getOrder, createOrder, updateOrderToPaid, updateOrderToDelivered, getAllOrders, getOrderForAnalysis };