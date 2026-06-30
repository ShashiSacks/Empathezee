const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/sessionMiddleware");
const { getProfile, updateProfile, getUserCommunities } = require("../controllers/userController");


// profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile", protect, updateProfile);


// user communities
router.get("/communities", protect, getUserCommunities);

module.exports = router;