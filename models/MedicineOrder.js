const mongoose = require("mongoose");

const medicineOrderSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    medicineName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["card", "upi", "cod"]
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentIntentId: {
        type: String,
        default: ""
    },
    paymentStatus: {
        type: String,
        default: "PENDING"
    },
    status: {
        type: String,
        default: "PENDING",
        enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("MedicineOrder", medicineOrderSchema);
