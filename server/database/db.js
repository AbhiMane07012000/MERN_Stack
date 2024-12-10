const mongoose = require('mongoose');

module.exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB is connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); 
    }
};
