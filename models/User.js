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
    }],

    welcomeEmailSent: {
        type: Boolean,
        default: false
    },

    emailNotifications: {
        type: Boolean,
        default: true
    },

    // Doctor profile specific fields
    specialization: {
        type: String,
        default: ""
    },

    qualifications: {
        type: String,
        default: ""
    },

    experienceYears: {
        type: Number,
        default: 0
    },

    clinicName: {
        type: String,
        default: ""
    },

    clinicAddress: {
        type: String,
        default: ""
    },

    consultationFee: {
        type: Number,
        default: 0
    },

    availableDays: {
        type: String,
        default: "Mon - Sat"
    },

    availableHours: {
        type: String,
        default: "09:00 AM - 05:00 PM"
    },

    licenseNumber: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    isVerifiedDoctor: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

userSchema.index({ role: 1, specialization: 1 });
userSchema.index({ role: 1, isVerifiedDoctor: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);