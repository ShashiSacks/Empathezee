const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        default: null
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: null
    },

    disease: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    country: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    district: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ["user", "doctor", "admin"],
        default: "user"
    },

    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);