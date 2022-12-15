// external import
const mongoose = require('mongoose');

// establish database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database successfully!');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
module.exports = connectDB;