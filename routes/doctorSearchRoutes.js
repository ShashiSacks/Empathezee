const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/sessionMiddleware");
const { searchDoctors } = require("../controllers/doctorSearchController");


// render the search page or execute nominatim osm search
router.get("/doctor/search", protectUser, searchDoctors);

module.exports = router;
