// external import
const express = require('express');

// create router
const router = express.Router();

// interal imports
const { getAllUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser } = require("../handlers/userHandler");
const { verifyLoggedIn, verifyAdmin } = require('../middlewares/verifyAuthToken');

// * user routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// user logged in routes
router.use(verifyLoggedIn);
router.get('/profile/:id', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/review/:productId', writeReview);

// * admin routes
router.use(verifyAdmin);
router.get("/", getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
module.exports = router;