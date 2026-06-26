const express = require("express");
const router = express.Router();

const {
    orderMedicine,
    confirmPayment
} = require("../controllers/medicineController");

const { protect } = require("../middleware/sessionMiddleware");

// Book medicine order
router.post("/order", protect, orderMedicine);

// Confirm Stripe payment
router.post("/confirm-payment", protect, confirmPayment);

module.exports = router;

