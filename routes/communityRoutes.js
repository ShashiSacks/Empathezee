const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/sessionMiddleware");

const {
    createCommunity,
    getCommunities,
    getCommunityById,
    getCommunityPosts,
    getCommunityMembers,
    getCommunityStats,
    searchCommunities,
    joinCommunity,
    leaveCommunity,
    deleteCommunity
} = require("../controllers/communityController");

// Create Community
router.post("/", protect, createCommunity);

// Get All Communities
router.get("/", getCommunities);

// Search Communities
router.get("/search", searchCommunities);

// Get Community By ID
router.get("/:id", getCommunityById);

// Get Posts of a Community
router.get("/:id/posts", getCommunityPosts);

// Get Community Members
router.get("/:id/members", getCommunityMembers);

// Get Community Statistics
router.get("/:id/stats", getCommunityStats);

// Join Community
router.post("/:id/join", protect, joinCommunity);

// Leave Community
router.post("/:id/leave", protect, leaveCommunity);

// Delete Community
router.delete("/:id", protect, deleteCommunity);

module.exports = router;