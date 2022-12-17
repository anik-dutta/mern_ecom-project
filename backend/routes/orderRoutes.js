// external imports
const express = require('express');
// create router
const router = express.Router();

// interal imports
const { getUserOrders, getOrder, createOrder, updateOrderToPaid, updateOrderToDelivered, getAllOrders, getOrderForAnalysis } = require('../handlers/orderHandler');
const { verifyLoggedIn, verifyAdmin } = require('../middlewares/verifyAuthToken');

// * user routes
router.use(verifyLoggedIn);
router.get('/', getUserOrders);
router.get('/user/:id', getOrder);
router.post('/', createOrder);
router.put('/paid/:id', updateOrderToPaid);

// * admin routes
router.use(verifyAdmin);
router.get('/admin', getAllOrders);
router.get('/analysis/:date', getOrderForAnalysis);
router.put('/delivered/:id', updateOrderToDelivered);

module.exports = router;
