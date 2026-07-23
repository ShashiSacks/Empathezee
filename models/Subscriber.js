const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        subscribedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ["active", "unsubscribed"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
