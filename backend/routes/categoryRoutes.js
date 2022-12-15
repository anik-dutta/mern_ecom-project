// external imports
const express = require('express');

// internal imports
const { getCategories, createCategory, deleteCategory, saveAttr } = require("../handlers/categoryHandler");
const { verifyLoggedIn, verifyAdmin } = require('../middlewares/verifyAuthToken');

// create router
const router = express();

// * user routes
router.get("/", getCategories);

// * admin routes
router.use(verifyLoggedIn);
router.use(verifyAdmin);
router.post("/", createCategory);
router.post("/attr", saveAttr);
router.delete("/:category", deleteCategory);

module.exports = router;