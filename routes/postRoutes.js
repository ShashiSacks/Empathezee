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


// create post
router.post("/", protect, createPost);


// get all posts
router.get("/", getPosts);


// update post
router.put("/:id", protect, updatePost);


// like post
router.put("/:id/like", protect, likePost);
router.post("/like/:id", protect, likePost);


// unlike post
router.put("/:id/unlike", protect, unlikePost);
router.post("/unlike/:id", protect, unlikePost);


// delete post
router.delete("/:id", protect, deletePost);

module.exports = router;