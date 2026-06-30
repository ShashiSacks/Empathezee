const express = require("express");
const router = express.Router();

const {
    getPendingPosts,
    reviewPost
} = require("../controllers/doctorPostController");

const { protectDoctor } = require("../middleware/sessionMiddleware");

// get pending posts
router.get("/pending", protectDoctor, getPendingPosts);

// review post (supports PUT for API and POST for HTML forms)
router.put("/review/:id", protectDoctor, reviewPost);
router.post("/review/:id", protectDoctor, reviewPost);

module.exports = router;
