const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String,
            required: true
        },

        disease: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["online", "offline"],
            default: "online"
        },

        meetingTime: {
            type: String,
            default: ""
        },

        meetingDate: {
            type: String,
            default: ""
        },

        meetingPlace: {
            type: String,
            default: ""
        },

        paymentType: {
            type: String,
            enum: ["free", "paid"],
            default: "free"
        },

        price: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Community", communitySchema);