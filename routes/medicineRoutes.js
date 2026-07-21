const express = require("express");
const router = express.Router();

const { orderMedicine, confirmPayment, getStripeKey } = require("../controllers/medicineController");
const { protect } = require("../middleware/sessionMiddleware");


// book medicine order
router.post("/order", protect, orderMedicine);


// confirm stripe payment
router.post("/confirm-payment", protect, confirmPayment);

// get stripe public key
router.get("/stripe-key", protect, getStripeKey);

module.exports = router;
