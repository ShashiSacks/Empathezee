const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/sessionMiddleware");

const {
    createComment,
    getCommentsByPost,
    deleteComment
} = require("../controllers/commentController");

// create comment
router.post("/", protect, createComment);

// get comments of a post
router.get("/:postId", protect, getCommentsByPost);

// delete comment
router.delete("/:id", protect, deleteComment);

module.exports = router;