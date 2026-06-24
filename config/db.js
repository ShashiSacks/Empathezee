const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        // Auto-seed default communities and posts on startup
        const seedCommunities = require("./seedCommunities");
        await seedCommunities();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;