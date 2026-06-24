const Comment = require("../models/Comment");

// CREATE COMMENT
const createComment = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const { postId, content } = req.body;

        if (!postId || !content) {
            return res.status(400).json({
                message: "postId and content are required"
            });
        }

        const Post = require("../models/Post");
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            post: postId,
            author: userId,
            content: content.trim()
        });

        // populate author for frontend use
        const fullComment = await Comment.findById(comment._id)
            .populate("author", "username email");

        // REAL-TIME (if socket exists)
        const io = req.app.get("io");
        if (io) {
            io.emit("new-comment", fullComment);
        }

        if (req.accepts('html')) {
            return res.redirect(`/community/${post.community}`);
        }

        return res.status(201).json({
            message: "Comment created successfully",
            comment: fullComment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// GET COMMENTS BY POST
const getCommentsByPost = async (req, res) => {
    try {

        const comments = await Comment.find({
            post: req.params.postId
        })
        .populate("author", "username email")
        .sort({ createdAt: 1 });

        return res.status(200).json({
            total: comments.length,
            comments
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await Comment.findByIdAndDelete(req.params.id);

        // REAL-TIME DELETE EVENT
        const io = req.app.get("io");
        if (io) {
            io.emit("delete-comment", { commentId: req.params.id });
        }

        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment
};