const express = require("express");
const router = express.Router();

const {
    getMedicines,
    getMedicinesByDisease,
    addMedicine
} = require("../controllers/medicineController");

const { protect } = require("../middleware/sessionMiddleware");

// Get all medicines (supports search query)
router.get("/", protect, getMedicines);

// Add medicine (moderators/doctors)
router.post("/", protect, addMedicine);

// Get medicines by disease
router.get("/by-disease/:disease", protect, getMedicinesByDisease);

module.exports = router;
