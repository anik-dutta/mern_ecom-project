// external import
const jwt = require('jsonwebtoken');

const verifyLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(403).send('Authentication failed!');
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).send('Unauthorized request!');
        }
    } catch (error) {
        next(error);
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).send('Unauthorized. Administration permission required.');
    }
};

module.exports = { verifyLoggedIn, verifyAdmin };