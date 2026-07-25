const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/sessionMiddleware");
const { searchDoctors } = require("../controllers/doctorSearchController");


// API endpoint for doctor search by symptom & location
router.get("/doctor-search", searchDoctors);
router.get("/doctor/search", searchDoctors);

module.exports = router;
