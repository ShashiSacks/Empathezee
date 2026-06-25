const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // For direct telehealth chats
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    // For telehealth chat contextual grouping
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null
    },
    // For community-wide real-time group chats
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        default: null
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);
