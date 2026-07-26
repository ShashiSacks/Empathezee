const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    disease: {
        type: String,
        required: true
    },

    requiresPrescription: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

medicineSchema.index({ name: 1 });
medicineSchema.index({ disease: 1 });

module.exports = mongoose.model("Medicine", medicineSchema);