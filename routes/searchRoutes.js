const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/sessionMiddleware");
const {
    searchDisease,
    searchMedicineInfo,
    findDoctors,
    getDoctorSearchUi
} = require("../controllers/searchController");

// Google custom search for disease info
router.get("/search-disease", protectUser, searchDisease);

// Google custom search for medicine details
router.get("/medicine-info", protectUser, searchMedicineInfo);

// Nominatim OpenStreetMap find doctors nearby
router.get("/find-doctors", protectUser, findDoctors);

// Doctor search UI page
router.get("/doctor-search-ui", protectUser, getDoctorSearchUi);

module.exports = router;
