const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/sessionMiddleware");
const { searchDoctors } = require("../controllers/doctorSearchController");

// Render the search page or execute Nominatim OSM search
router.get("/doctor/search", protectUser, searchDoctors);

module.exports = router;
