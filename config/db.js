require("dotenv").config();
const mongoose = require("mongoose");

let cachedPromise = null;

const connectDB = async () => {
    // 1. Return existing active connection if ready
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // 2. Return pending connection promise if in progress
    if (cachedPromise && mongoose.connection.readyState === 2) {
        return cachedPromise;
    }

    const primaryUri = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
    const localUri = "mongodb://127.0.0.1:27017/empathezee";

    console.log("✓ Environment variables loaded");

    const tryConnect = async (uri, isFallback = false) => {
        const connectionType = isFallback ? "Local Fallback" : (primaryUri ? "Remote Atlas" : "Local Database");
        console.log(`✓ Connecting to MongoDB (${connectionType})...`);

        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log(`✓ MongoDB Connected Successfully (${connectionType})`);
            console.log(`✓ Connection State (readyState): ${mongoose.connection.readyState}`);
            return conn;
        } catch (err) {
            console.error(`❌ MongoDB Connection Failed (${connectionType}):`);

            if (err.code === 8000 || (err.errmsg && err.errmsg.includes("bad auth")) || (err.message && err.message.includes("bad auth"))) {
                console.error("  ➜ Cause: AUTHENTICATION FAILED (bad auth)");
                console.error("  ➜ Description: The username or password in MONGO_URL was rejected by MongoDB Atlas.");
                console.error("  ➜ Fix: Please update username/password in MongoDB Atlas > Database Access and update MONGO_URL in .env and Vercel.");
            } else if (err.name === "MongoServerSelectionError") {
                console.error("  ➜ Cause: NETWORK TIMEOUT / HOST UNREACHABLE");
                console.error("  ➜ Description: Could not connect to MongoDB Atlas cluster within timeout limit.");
                console.error("  ➜ Fix: Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0 (Allow Access from Anywhere).");
            } else if (err.name === "MongoParseError") {
                console.error("  ➜ Cause: INVALID MONGO URI");
                console.error("  ➜ Description:", err.message);
            } else {
                console.error("  ➜ Details:", err.message);
            }

            throw err;
        }
    };

    if (!cachedPromise) {
        cachedPromise = (async () => {
            if (primaryUri) {
                try {
                    return await tryConnect(primaryUri, false);
                } catch (primaryErr) {
                    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
                        cachedPromise = null;
                        throw primaryErr;
                    }
                    console.log("⚠️ Attempting fallback to local MongoDB...");
                }
            }

            try {
                return await tryConnect(localUri, true);
            } catch (localErr) {
                cachedPromise = null;
                throw localErr;
            }
        })();
    }

    return cachedPromise;
};

module.exports = connectDB;