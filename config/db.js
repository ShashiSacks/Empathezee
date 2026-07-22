const mongoose = require("mongoose");

const connectDB = async () => {
    const primaryUri = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
    const localUri = "mongodb://127.0.0.1:27017/empathezee";

    if (primaryUri) {
        try {
            await mongoose.connect(primaryUri);
            console.log("MongoDB Connected (Remote Atlas)");
            return;
        } catch (error) {
            console.error("MongoDB Atlas Connection Failed:", error.message);
            console.log("Attempting fallback to local MongoDB...");
        }
    }

    try {
        await mongoose.connect(localUri);
        console.log("MongoDB Connected (Local Fallback)");
    } catch (localErr) {
        console.error("Local MongoDB Connection Failed:", localErr.message);
        process.exit(1);
    }
};

module.exports = connectDB;