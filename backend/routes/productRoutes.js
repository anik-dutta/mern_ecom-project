// external imports
const express = require('express');

// interal imports
const { getProducts, getProductById, getBestsellers, adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct, adminUpload, adminDeleteProductImage } = require('../handlers/productHandler');
const { verifyLoggedIn, verifyAdmin } = require('../middlewares/verifyAuthToken');

// create router
const router = express.Router();

// * user routes
router.get('/', getProducts);
router.get('/category/:categoryName/search/:searchQuery', getProducts);
router.get('/category/:categoryName', getProducts);
router.get('/search/:searchQuery', getProducts);
router.get('/bestsellers', getBestsellers);
router.get('/get-one/:id', getProductById);

// * admin routes
router.use(verifyLoggedIn);
router.use(verifyAdmin);
router.get('/admin', adminGetProducts);
router.post('/admin/upload', adminUpload);
router.post('/admin', adminCreateProduct);
router.put('/admin/:id', adminUpdateProduct);
router.delete('/admin/image/:imagePath/:productId', adminDeleteProductImage);
router.delete('/admin/:id', adminDeleteProduct);

module.exports = router;