const express = require("express");
const router = express.Router();

const {
    getMedicines,
    getMedicinesByDisease,
    addMedicine,
    orderMedicine,
    confirmPayment
} = require("../controllers/medicineController");

const { protect } = require("../middleware/sessionMiddleware");

// Get all medicines (supports search query)
router.get("/", protect, getMedicines);

// Add medicine (moderators/doctors)
router.post("/", protect, addMedicine);

// Get medicines by disease
router.get("/by-disease/:disease", protect, getMedicinesByDisease);

// Book medicine order
router.post("/order", protect, orderMedicine);

// Confirm Stripe payment
router.post("/confirm-payment", protect, confirmPayment);

module.exports = router;
