const express = require("express");
const router = express.Router();

const {
    getPendingPosts,
    reviewPost
} = require("../controllers/doctorPostController");

const { protectDoctor } = require("../middleware/sessionMiddleware");

// GET PENDING POSTS
router.get(
    "/pending",
    protectDoctor,
    getPendingPosts
);

// REVIEW POST
router.put(
    "/review/:id",
    protectDoctor,
    reviewPost
);

router.post(
    "/review/:id",
    protectDoctor,
    reviewPost
);

module.exports = router;
