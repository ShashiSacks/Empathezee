const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../controllers/analyticsController");

const { protect, authorizeRoles } = require("../middleware/sessionMiddleware");

// only doctor or admin can see analytics
router.get(
    "/",
    protect,
    authorizeRoles("doctor", "admin"),
    getAnalytics
);

module.exports = router;
