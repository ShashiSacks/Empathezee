const express = require("express");
const router = express.Router();

const { orderMedicine, confirmPayment, searchMedicine, getStripeKey } = require("../controllers/medicineController");
const { protect } = require("../middleware/sessionMiddleware");

// search medicine database
router.get("/search", protect, searchMedicine);

// book medicine order
router.post("/order", protect, orderMedicine);


// confirm stripe payment
router.post("/confirm-payment", protect, confirmPayment);

// get stripe public key
router.get("/stripe-key", protect, getStripeKey);

module.exports = router;
