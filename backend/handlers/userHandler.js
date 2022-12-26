// external import
const { ObjectId } = require('mongodb');

// internal imports
const User = require('../models/UserModel');
const Review = require('../models/ReviewModel');
const Product = require('../models/ProductModel');
const { hashPassword, matchPasswords } = require('../utils/hashPassword');
const { generateAuthToken } = require('../utils/generateAuthToken');

// * (for user) middleware for get request
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail();
        return res.send(user);
    } catch (error) {
        next(error);
    }
};

// * (for user) middleware for post requests
const registerUser = async (req, res, next) => {
    try {
        const { name, lastName, email, password } = req.body;
        if (!(name && lastName && email && password)) {
            return res.status(400).send('All inputs are required!');
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send('User already exists!');
        } else {
            const hashedPassword = hashPassword(password);
            const user = await User.create({
                name, lastName, email: email.toLowerCase(), password: hashedPassword
            });
            const userInfo = {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin
            };
            res.cookie('access_token', generateAuthToken(userInfo), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            })
                .status(201)
                .json({
                    success: 'User created successfully!',
                    userCreated: userInfo,
                    // userCreated: {
                    //     _id: user.id,
                    //     name: user.name,
                    //     lastName: user.lastName,
                    //     email: user.email,
                    //     isAdmin: user.isAdmin
                    // },
                });
        }
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password, doNotLogout } = req.body;
        if (!(email && password)) {
            return res.status(400).send('All inputs are required!');
        }
        const user = await User.findOne({ email });

        if (user && matchPasswords(password, user.password)) {
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            };
            if (doNotLogout) {
                const nDaysInMS = 86400000 * 30;
                cookieParams = { ...cookieParams, maxAge: nDaysInMS };
            }
            const userInfo = {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin
            };

            res.cookie('access_token', generateAuthToken(userInfo), cookieParams)
                .status(201)
                .json({
                    success: 'User logged in',
                    userLoggedIn: { ...userInfo, doNotLogout }
                });
        } else {
            return res.status(401).send('Wrong credentials!');
        }
    } catch (error) {
        next(error);
    }
};

const writeReview = async (req, res, next) => {
    try {
        const session = await Review.startSession();

        const { comment, rating } = req.body;
        if (!(comment && rating)) {
            return res.status(400).send("All inputs are required");
        }

        let reviewId = ObjectId();

        session.startTransaction();
        await Review.create([
            {
                _id: reviewId,
                comment: comment,
                rating: Number(rating),
                user: { _id: req.user._id, name: req.user.name + " " + req.user.lastName },
            }
        ], { session: session });

        const product = await Product.findById(req.params.productId).populate("reviews").session(session);

        const alreadyReviewed = product.reviews.find((review) => review.user._id.toString() === req.user._id.toString());

        if (alreadyReviewed) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send('Product already reviewed!');
        }

        let reviewArray = [...product.reviews];
        reviewArray.push({ rating: rating });
        product.reviews.push(reviewId);

        if (product.reviews.length === 1) {
            product.reviewsNumber = 1;
            product.rating = Number(rating);
        } else {
            product.reviewsNumber = product.reviews.length;
            product.rating = reviewArray.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0) / product.reviews.length;
        }
        await product.save();

        await session.commitTransaction();
        session.endSession();
        res.send('Review submitted!');
    } catch (err) {
        next(err);
    }
};

// * (for user) middleware for put request
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).orFail();
        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.phoneNumber = req.body.phoneNumber;
        user.address = req.body.address;
        user.country = req.body.country;
        user.zipCode = req.body.zipCode;
        user.city = req.body.city;
        user.state = req.body.state;

        if (req.body.password !== user.password) {
            user.password = hashPassword(req.body.password);
        }
        await user.save();

        res.json({
            success: "User updated",
            userUpdated: {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for get requests
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        return res.json(users);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('name lastName email isAdmin').orFail();
        return res.json(user);
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for put request
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail();

        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        await user.save();
        res.send('User updated');
    } catch (error) {
        next(error);
    }
};

// * (for admin) middleware for delete request
const deleteUser = async (req, res, next) => {
    try {
        // const user = await User.findById(req.params.id).orFail();

        // await user.deleteOne();

        await User.findByIdAndDelete(req.params.id).orFail();
        res.send('User deleted');
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser };