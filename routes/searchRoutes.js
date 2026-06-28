const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/sessionMiddleware");
const {
    searchDisease,
    searchMedicineInfo
} = require("../controllers/searchController");

// Google custom search for disease info
router.get("/search-disease", protectUser, searchDisease);

// Google custom search for medicine details
router.get("/medicine-info", protectUser, searchMedicineInfo);

module.exports = router;
