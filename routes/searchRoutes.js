const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/sessionMiddleware");
const { searchDisease, searchMedicineInfo } = require("../controllers/searchController");


// google custom search for disease info
router.get("/search-disease", protectUser, searchDisease);


// google custom search for medicine details
router.get("/medicine-info", protectUser, searchMedicineInfo);

module.exports = router;
