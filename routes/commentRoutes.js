const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/sessionMiddleware");

const {
    createComment,
    getCommentsByPost,
    deleteComment
} = require("../controllers/commentController");

// CREATE COMMENT
router.post("/", protect, createComment);

// GET COMMENTS OF A POST
router.get("/:postId", protect, getCommentsByPost);

// DELETE COMMENT
router.delete("/:id", protect, deleteComment);

module.exports = router;