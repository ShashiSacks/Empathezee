const mongoose = require("mongoose");

let cachedPromise = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (cachedPromise && mongoose.connection.readyState === 2) {
        return cachedPromise;
    }

    const primaryUri = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
    const localUri = "mongodb://127.0.0.1:27017/empathezee";

    const uri = primaryUri || localUri;

    if (!cachedPromise) {
        cachedPromise = mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        }).then((m) => {
            console.log(`MongoDB Connected (${primaryUri ? "Remote Atlas" : "Local Fallback"})`);
            return m;
        }).catch((err) => {
            cachedPromise = null;
            console.error("MongoDB Connection Failed:", err.message);
            throw err;
        });
    }

    return cachedPromise;
};

module.exports = connectDB;