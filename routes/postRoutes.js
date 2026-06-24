const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/sessionMiddleware");

const {
    createPost,
    getPosts,
    likePost,
    unlikePost,
    updatePost,
    deletePost
} = require("../controllers/postController");

// Create Post
router.post("/", protect, createPost);

// Get All Posts
router.get("/", getPosts);

// Update Post
router.put("/:id", protect, updatePost);

// Like Post
router.put("/:id/like", protect, likePost);
router.post("/like/:id", protect, likePost);

// Unlike Post
router.put("/:id/unlike", protect, unlikePost);
router.post("/unlike/:id", protect, unlikePost);

// Delete Post
router.delete("/:id", protect, deletePost);

module.exports = router;