// external import
const mongoose = require('mongoose');

// internal import
const User = require('./UserModel');

// creating schema
const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
    orderTotal: {
        itemsCount: { type: Number, required: true },
        cartSubtotal: { type: Number, required: true }
    },
    cartItems: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { path: { type: String, required: true } },
            quantity: { type: Number, required: true },
            count: { type: Number, required: true }
        }
    ],
    paymentMethod: {
        type: String,
        required: true
    },
    transactionResult: {
        status: { type: String },
        createTime: { type: String },
        amount: { type: Number }
    },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date }
}, {
    timestamps: true
});

// creating model
const Order = mongoose.model('Order', orderSchema);

// get the real time orders data by socket.io
Order.watch().on('change', (data) => {
    if (data.operationType === 'insert') {
        io.emit('newOrder', data.fullDocument);
    }
});

module.exports = Order;