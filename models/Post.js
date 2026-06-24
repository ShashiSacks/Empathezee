const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true,
        index: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    disease: {
        type: String,
        required: true,
        index: true
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    status: {
        type: String,
        enum: ["PENDING", "SAFE", "FAKE", "SUSPICIOUS"],
        default: "PENDING",
        index: true
    },

    aiReason: {
        type: String,
        default: ""
    },

    riskScore: {
        type: Number,
        default: 0
    },

    doctorVerification: [
        {
            doctorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            verdict: {
                type: String,
                enum: ["VERIFIED", "NOT_VERIFIED", "SUSPICIOUS"],
                required: true
            },
            comment: {
                type: String,
                default: ""
            },
            verifiedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post"
});

module.exports = mongoose.model("Post", postSchema);