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

// create community
router.post("/", protect, createCommunity);

// get all communities
router.get("/", getCommunities);

// search communities
router.get("/search", searchCommunities);

// get community by id
router.get("/:id", getCommunityById);

// get posts of a community
router.get("/:id/posts", getCommunityPosts);

// get community members
router.get("/:id/members", getCommunityMembers);

// get community statistics
router.get("/:id/stats", getCommunityStats);

// join community
router.post("/:id/join", protect, joinCommunity);

// leave community
router.post("/:id/leave", protect, leaveCommunity);

// delete community
router.delete("/:id", protect, deleteCommunity);

module.exports = router;