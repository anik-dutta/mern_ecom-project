// external import
const jwt = require('jsonwebtoken');

const generateAuthToken = (userInfo) => {
    const { _id, name, lastName, email, isAdmin } = userInfo;
    return jwt.sign(
        { _id, name, lastName, email, isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' });
};
module.exports = { generateAuthToken };