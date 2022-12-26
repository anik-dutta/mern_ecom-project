// external imports
const express = require('express');
const jwt = require('jsonwebtoken');

// internal imports
const productRoutes = require('./productRoutes');
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");

// starting sub-app 'api'
const api = express();

// routes
api.get('/get-token', (req, res) => {
    try {
        const accessToken = req.cookies['access_token'];
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        return res.json({ token: decoded.name, isAdmin: decoded.isAdmin });
    } catch (error) {
        return res.status(401).send('Unauthorized! Invalid Token');
    }
});

api.get('/logout', (req, res) => {
    return res.clearCookie('access_token').send('access token cleared');
});

api.use('/products', productRoutes);
api.use("/categories", categoryRoutes);
api.use("/users", userRoutes);
api.use("/orders", orderRoutes);

module.exports = api;