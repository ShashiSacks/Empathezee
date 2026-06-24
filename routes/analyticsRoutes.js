const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../controllers/analyticsController");

const { protect, authorizeRoles } = require("../middleware/sessionMiddleware");

// ONLY DOCTOR OR ADMIN CAN SEE ANALYTICS
router.get(
    "/",
    protect,
    authorizeRoles("doctor", "admin"),
    getAnalytics
);

module.exports = router;
