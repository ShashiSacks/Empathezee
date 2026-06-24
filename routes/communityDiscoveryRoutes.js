const express = require("express");
const router = express.Router();

const {
    getRecommendedCommunities
} = require("../controllers/communityDiscoveryController");

const { protect } = require("../middleware/sessionMiddleware");

// Get recommended communities
router.get("/recommend", protect, getRecommendedCommunities);

module.exports = router;